#!/usr/bin/env node
/**
 * generate_api.cjs
 * ------------------------------------------------------------------
 * Reads the OpenAPI 3.0 JSON (from a local file OR a live URL) and
 * generates typed gateway files + @types following the project pattern:
 *
 *   src/api/services/{domain}/
 *     @types/
 *       {Schema}.ts
 *     {domain}Gateway.ts
 *   src/api/api.ts
 *
 * Usage:
 *   node generate_api.cjs                        # reads ./openapi.json
 *   node generate_api.cjs http://localhost:8080/v3/api-docs   # fetches from URL
 * ------------------------------------------------------------------
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// ─── Config ───────────────────────────────────────────────────────────────────
// Accepts --api-doc=<url>, --api-doc <url>, a positional URL, or defaults to openapi.json
function resolveSource(argv) {
    const flagIndex = argv.findIndex(a => a === '--api-doc' || a.startsWith('--api-doc='));
    if (flagIndex !== -1) {
        const flagArg = argv[flagIndex];
        if (flagArg.includes('=')) return flagArg.split('=').slice(1).join('=').trim();
        if (argv[flagIndex + 1]) return argv[flagIndex + 1].trim();
    }
    // Fallback: first positional arg after node + script
    const positional = argv.slice(2).find(a => !a.startsWith('-'));
    return positional || 'openapi.json';
}

const SOURCE = resolveSource(process.argv);
const OUTPUT_DIR = path.join(__dirname, 'src/api/services');
const API_FILE = path.join(__dirname, 'src/api/api.ts');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
const toCamelCase = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/**
 * Resolve an OpenAPI schema to a TypeScript type string.
 * Handles $ref, arrays, primitives and objects.
 */
function mapType(schema) {
    if (!schema) return 'unknown';
    if (schema.$ref) return capitalize(schema.$ref.split('/').pop());
    if (schema.type === 'array') return `Array<${mapType(schema.items)}>`;
    if (schema.type === 'integer' || schema.type === 'number') return 'number';
    if (schema.type === 'boolean') return 'boolean';
    if (schema.type === 'string') return 'string';
    if (schema.type === 'object') return 'Record<string, unknown>';
    return 'unknown';
}

/**
 * Given a schema definition object build the TS type body.
 * Required fields become non-optional; optional ones keep `?`.
 */
function buildTypeBody(schema, allTypes) {
    const props = schema.properties || {};
    const required = new Set(schema.required || []);
    const imports = new Map(); // typeName -> line

    let body = '';
    for (const [propName, propSchema] of Object.entries(props)) {
        const optional = required.has(propName) ? '' : '?';
        const tsType = mapType(propSchema);
        body += `  ${propName}${optional}: ${tsType};\n`;

        // Collect cross-type imports
        if (propSchema.$ref) {
            const refName = capitalize(propSchema.$ref.split('/').pop());
            imports.set(refName, refName);
        }
        if (propSchema.type === 'array' && propSchema.items?.$ref) {
            const refName = capitalize(propSchema.items.$ref.split('/').pop());
            imports.set(refName, refName);
        }
    }

    return { body, imports };
}

/**
 * Determine which gateway "domain" a given schema belongs to by checking
 * which service actually references it. Falls back to 'shared'.
 */
function assignOwner(schemaName, services) {
    for (const [svcName, svc] of Object.entries(services)) {
        if (svc.usedTypes.has(schemaName)) return svcName;
    }
    // Simple prefix name matching as secondary heuristic  
    const lower = schemaName.toLowerCase().replace(/request|response/g, '');
    for (const svcName of Object.keys(services)) {
        if (lower.startsWith(svcName.replace(/-/g, '').toLowerCase())) return svcName;
    }
    return 'shared';
}

/**
 * Clean-up duplicate suffixes added by Spring-doc (findAll_1, deleteById_2 …)
 */
const cleanOperationId = id => id.replace(/_\d+$/, '');

/**
 * Build a smart method name from HTTP method + path when operationId is generic.
 * E.g.  GET /cartoes/{id}  → findById
 *       POST /cartoes       → create
 *       DELETE /cartoes/{id}→ deleteById
 */
function inferMethodName(httpMethod, pathKey) {
    const hasId = pathKey.includes('{');
    switch (httpMethod) {
        case 'GET': return hasId ? 'findById' : 'findAll';
        case 'POST': return 'create';
        case 'PUT': return hasId ? 'update' : 'save';
        case 'PATCH': return hasId ? 'patch' : 'save';
        case 'DELETE': return hasId ? 'deleteById' : 'deleteAll';
        default: return httpMethod.toLowerCase();
    }
}

// ─── Fetch spec ───────────────────────────────────────────────────────────────
async function loadSpec(source) {
    if (/^https?:\/\//i.test(source)) {
        console.log(`📡 Fetching OpenAPI spec from ${source} …`);
        return new Promise((resolve, reject) => {
            const lib = source.startsWith('https') ? https : http;
            lib.get(source, res => {
                let data = '';
                res.on('data', chunk => (data += chunk));
                res.on('end', () => {
                    try { resolve(JSON.parse(data)); }
                    catch (e) { reject(new Error('Failed to parse remote JSON: ' + e.message)); }
                });
            }).on('error', reject);
        });
    }
    console.log(`📂 Reading spec from ${source} …`);
    return JSON.parse(fs.readFileSync(source, 'utf8'));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const spec = await loadSpec(SOURCE);

    const schemas = spec.components?.schemas || {};
    const paths = spec.paths || {};

    // ── 1. Build service map keyed by camelCased tag name ────────────────────
    const services = {}; // { [name]: { methods: [], usedTypes: Set<string> } }

    for (const [pathKey, pathItem] of Object.entries(paths)) {
        for (const [httpMethod, operation] of Object.entries(pathItem)) {
            if (!operation.tags) continue;
            const rawTag = operation.tags[0];                     // e.g. "gasto-recorrente-controller"
            const svcName = toCamelCase(rawTag.replace(/-controller$/, '')); // e.g. "gastoRecorrente"

            if (!services[svcName]) {
                services[svcName] = { methods: [], usedTypes: new Set() };
            }

            const METHOD = httpMethod.toUpperCase();
            const opId = cleanOperationId(operation.operationId || '');
            const name = opId || inferMethodName(METHOD, pathKey);

            // ── Request body type ──────────────────────────────────────────────
            let bodyTypeName = null;
            const bodySchema = operation.requestBody?.content?.['application/json']?.schema;
            if (bodySchema?.$ref) {
                bodyTypeName = capitalize(bodySchema.$ref.split('/').pop());
                services[svcName].usedTypes.add(bodyTypeName);
            }

            // ── Path params ───────────────────────────────────────────────────
            const pathParams = (operation.parameters || []).filter(p => p.in === 'path');

            // ── Query params ──────────────────────────────────────────────────
            const queryParams = (operation.parameters || []).filter(p => p.in === 'query');

            // ── Response type ─────────────────────────────────────────────────
            let responseTypeName = null;
            const respContent = operation.responses?.['200']?.content;
            if (respContent) {
                const respSchema = respContent['*/*']?.schema || respContent['application/json']?.schema;
                if (respSchema?.$ref) {
                    responseTypeName = capitalize(respSchema.$ref.split('/').pop());
                    services[svcName].usedTypes.add(responseTypeName);
                } else if (respSchema?.type === 'array' && respSchema.items?.$ref) {
                    responseTypeName = `Array<${capitalize(respSchema.items.$ref.split('/').pop())}>`;
                    services[svcName].usedTypes.add(capitalize(respSchema.items.$ref.split('/').pop()));
                }
            }

            services[svcName].methods.push({
                name,
                path: pathKey,
                method: METHOD,
                pathParams,
                queryParams,
                bodyTypeName,
                responseTypeName,
            });
        }
    }

    // ── 2. Assign owner service to each schema ────────────────────────────────
    const schemaOwners = {};
    for (const schemaName of Object.keys(schemas)) {
        schemaOwners[schemaName] = assignOwner(schemaName, services);
    }

    // ── 3. Write @types files ─────────────────────────────────────────────────
    for (const [schemaName, schema] of Object.entries(schemas)) {
        const owner = schemaOwners[schemaName];
        const { body, imports } = buildTypeBody(schema, schemas);

        // Resolve import lines (cross-file only)
        const importLines = [];
        for (const [refName] of imports) {
            if (refName === schemaName) continue; // no self-import
            const refOwner = schemaOwners[refName] || 'shared';
            const rel = refOwner === owner ? `./${refName}` : `../../${refOwner}/@types/${refName}`;
            importLines.push(`import type { ${refName} } from "${rel}";`);
        }

        const content = [
            ...importLines,
            importLines.length ? '' : null,
            `export type ${schemaName} = {`,
            body.trimEnd(),
            `};`,
            '',
        ].filter(l => l !== null).join('\n');

        const dir = path.join(OUTPUT_DIR, owner, '@types');
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `${schemaName}.ts`), content);
        console.log(`  ✏️  @types/${schemaName}.ts  →  services/${owner}/@types/`);
    }

    // ── 4. Write gateway files ────────────────────────────────────────────────
    for (const [svcName, svc] of Object.entries(services)) {
        const importLines = [
            `import { gerarService } from "../gerarService";`,
            `import type { ServiceInputProps } from "../ServiceInputProps";`,
        ];

        // Collect type imports
        for (const typeName of svc.usedTypes) {
            const owner = schemaOwners[typeName] || 'shared';
            const rel = owner === svcName ? `./@types/${typeName}` : `../${owner}/@types/${typeName}`;
            importLines.push(`import type { ${typeName} } from "${rel}";`);
        }

        let methodsCode = '';
        const seenNames = new Map(); // detect duplicates and suffix them
        for (const m of svc.methods) {
            // Deduplicate method names
            const count = seenNames.get(m.name) || 0;
            seenNames.set(m.name, count + 1);
            const methodName = count === 0 ? m.name : `${m.name}${capitalize(m.method.toLowerCase())}`;

            // Build arg list
            const args = [];
            for (const p of m.pathParams) {
                args.push(`${p.name}: ${mapType(p.schema)}`);
            }

            // Build query type inline (or null)
            let queryType = 'null';
            if (m.queryParams.length > 0) {
                const fields = m.queryParams
                    .map(p => `${p.name}?: ${mapType(p.schema)}`)
                    .join('; ');
                queryType = `{ ${fields} }`;
            }

            const bodyType = m.bodyTypeName ?? 'null';
            args.push(`input: ServiceInputProps<${bodyType}, ${queryType}>`);

            // Template literal endpoint
            const endpoint = m.path.replace(/\{(\w+)\}/g, '${$1}');

            // Return type
            const retType = m.responseTypeName ?? 'void';

            methodsCode +=
                `  ${methodName}: async (${args.join(', ')}) =>\n` +
                `    await gerarService<${retType}>({\n` +
                `      endpoint: \`${endpoint}\`,\n` +
                `      method: "${m.method}",\n` +
                `      options: input,\n` +
                `    }),\n\n`;
        }

        const content =
            importLines.join('\n') + '\n\n' +
            `export const ${svcName}Gateway = {\n` +
            methodsCode +
            `};\n`;

        const dir = path.join(OUTPUT_DIR, svcName);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `${svcName}Gateway.ts`), content);
        console.log(`  ✏️  ${svcName}Gateway.ts`);
    }

    // ── 5. Write api.ts barrel ────────────────────────────────────────────────
    const importLines = Object.keys(services).map(
        svc => `import { ${svc}Gateway } from "./services/${svc}/${svc}Gateway";`
    );
    const exportLines = Object.keys(services).map(svc => `  ${svc}: ${svc}Gateway,`);

    const apiContent =
        importLines.join('\n') + '\n\n' +
        `export const api = {\n` +
        exportLines.join('\n') + '\n' +
        `};\n`;

    fs.writeFileSync(API_FILE, apiContent);
    console.log(`\n✅ Done! Generated ${Object.keys(services).length} gateways + api.ts\n`);
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
