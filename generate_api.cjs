#!/usr/bin/env node
/**
 * generate_api.cjs
 * ------------------------------------------------------------------
 * Reads the OpenAPI 3.0 JSON from a live Swagger URL and generates
 * typed gateway files + @types following the project pattern.
 *
 * Required:
 *   --api-doc <url>          URL of the OpenAPI JSON (e.g. /v3/api-docs)
 *
 * Optional:
 *   --out-dir <path>         Output directory for services (default: src/api/services)
 *
 * Usage:
 *   node generate_api.cjs --api-doc http://localhost:8080/v3/api-docs
 *   node generate_api.cjs --api-doc http://localhost:8080/v3/api-docs --out-dir src/api/services
 * ------------------------------------------------------------------
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// ─── Config ───────────────────────────────────────────────────────────────────
function parseArgs(argv) {
    const get = (flag) => {
        const i = argv.findIndex(a => a === flag || a.startsWith(flag + '='));
        if (i === -1) return null;
        const arg = argv[i];
        return arg.includes('=') ? arg.split('=').slice(1).join('=').trim() : (argv[i + 1] || null);
    };

    const apiDoc = get('--api-doc');
    if (!apiDoc) {
        console.error('\n❌  Missing required flag: --api-doc <url>');
        console.error('   Example: node generate_api.cjs --api-doc http://localhost:8080/v3/api-docs\n');
        process.exit(1);
    }

    const outDir = get('--out-dir') || 'src/api/services';
    return { apiDoc, outDir };
}

// ───────────────────────────────────────────────────────────────────
// parseArgs / OUTPUT_DIR are resolved inside main() so self-tests always run first.
// ───────────────────────────────────────────────────────────────────

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
 * Parse an existing @types file and extract the current field map + order.
 * Returns: [ { name, optional, type } ] in file order.
 */
function parseExistingType(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const src = fs.readFileSync(filePath, 'utf8');
    const fields = [];
    // Match lines like:  fieldName?: SomeType;
    const lineRe = /^\s+(\w+)(\??):\s*(.+?);\s*$/gm;
    let m;
    while ((m = lineRe.exec(src)) !== null) {
        fields.push({ name: m[1], optional: m[2] === '?', type: m[3].trim() });
    }
    return fields;
}

/**
 * Merge incoming fields (from OpenAPI) with existing file fields.
 * Rules:
 *   1. Existing fields keep their position.
 *   2. Type/optionality is updated only if it changed in the spec.
 *   3. New fields (not in existing) are appended at the end.
 *   4. Fields removed from spec are removed from the output.
 */
function mergeFields(existingFields, incomingFields) {
    const incomingMap = new Map(incomingFields.map(f => [f.name, f]));
    const result = existingFields
        .map(existing => {
            const incoming = incomingMap.get(existing.name);
            if (!incoming) return null; // spec removed it — delete from output
            // Only update if type or optionality actually changed
            const changed = incoming.optional !== existing.optional || incoming.type !== existing.type;
            return changed ? incoming : existing;
        })
        .filter(f => f !== null);
    // Append genuinely new fields
    const existingNames = new Set(existingFields.map(f => f.name));
    for (const f of incomingFields) {
        if (!existingNames.has(f.name)) result.push(f);
    }
    return result;
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
    // Arg parsing runs here, AFTER self-tests, so --api-doc is validated after tests pass
    const { apiDoc: SOURCE, outDir: OUT_DIR_REL } = parseArgs(process.argv);
    const OUTPUT_DIR = path.resolve(__dirname, OUT_DIR_REL);
    const API_FILE = path.join(path.dirname(OUTPUT_DIR), 'api.ts');

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
        const dir = path.join(OUTPUT_DIR, owner, '@types');
        const filePath = path.join(dir, `${schemaName}.ts`);
        const { body, imports } = buildTypeBody(schema, schemas);

        // Build incoming fields from the new spec body
        const incomingFields = [];
        const fieldRe = /^  (\w+)(\??):\s*(.+?);$/gm;
        let fm;
        while ((fm = fieldRe.exec(body)) !== null) {
            incomingFields.push({ name: fm[1], optional: fm[2] === '?', type: fm[3].trim() });
        }

        // Merge with existing file to preserve field order
        const existingFields = parseExistingType(filePath);
        const mergedFields = existingFields.length
            ? mergeFields(existingFields, incomingFields)
            : incomingFields;

        const mergedBody = mergedFields
            .map(f => `  ${f.name}${f.optional ? '?' : ''}: ${f.type};`)
            .join('\n');

        // Resolve import lines (cross-file only)
        const importLines = [];
        for (const [refName] of imports) {
            if (refName === schemaName) continue;
            const refOwner = schemaOwners[refName] || 'shared';
            const rel = refOwner === owner ? `./${refName}` : `../../${refOwner}/@types/${refName}`;
            importLines.push(`import type { ${refName} } from "${rel}";`);
        }

        const content = [
            ...importLines,
            importLines.length ? '' : null,
            `export type ${schemaName} = {`,
            mergedBody,
            `};`,
            '',
        ].filter(l => l !== null).join('\n');

        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, content);
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


// ─── Self-test Suite ─────────────────────────────────────────────────────────────────
function runSelfTests() {
    let passed = 0;
    let failed = 0;

    function assert(label, got, expected) {
        const ok = JSON.stringify(got) === JSON.stringify(expected);
        if (ok) {
            console.log(`  ✅ ${label}`);
            passed++;
        } else {
            console.error(`  ❌ ${label}`);
            console.error(`     Expected: ${JSON.stringify(expected)}`);
            console.error(`     Got:      ${JSON.stringify(got)}`);
            failed++;
        }
    }

    // ── Mock data: simulates an already-generated @types file ───────────────────
    //
    // Original order in the generated file:
    //   atributo01?: string
    //   atributo02?: string
    //   atributo03?: string
    const existingFields = [
        { name: 'atributo01', optional: true, type: 'string' },
        { name: 'atributo02', optional: true, type: 'string' },
        { name: 'atributo03', optional: true, type: 'string' },
    ];

    // ── TEST 1: Exact re-run — no changes ──────────────────────────────────
    // Incoming spec has same fields in same order
    const incomingSame = [
        { name: 'atributo01', optional: true, type: 'string' },
        { name: 'atributo02', optional: true, type: 'string' },
        { name: 'atributo03', optional: true, type: 'string' },
    ];
    assert(
        'TEST 1 — Re-run with same spec produces zero changes',
        mergeFields(existingFields, incomingSame),
        existingFields
    );

    // ── TEST 2: DTO reordered — file order must be preserved ────────────────
    // Backend changed order: atributo01, atributo03, atributo02
    const incomingReordered = [
        { name: 'atributo01', optional: true, type: 'string' },
        { name: 'atributo03', optional: true, type: 'string' },
        { name: 'atributo02', optional: true, type: 'string' },
    ];
    assert(
        'TEST 2 — DTO reorder is ignored (file order preserved)',
        mergeFields(existingFields, incomingReordered),
        existingFields  // order must remain: 01, 02, 03
    );

    // ── TEST 3: Type changed (string → number), position preserved ───────────
    // atributo02 becomes number; must stay in position 2
    const incomingTypeChange = [
        { name: 'atributo01', optional: true, type: 'string' },
        { name: 'atributo02', optional: true, type: 'number' }, // changed
        { name: 'atributo03', optional: true, type: 'string' },
    ];
    const expectedTypeChange = [
        { name: 'atributo01', optional: true, type: 'string' },
        { name: 'atributo02', optional: true, type: 'number' }, // updated in-place
        { name: 'atributo03', optional: true, type: 'string' },
    ];
    assert(
        'TEST 3 — Type change applied in current position (not moved)',
        mergeFields(existingFields, incomingTypeChange),
        expectedTypeChange
    );

    // ── TEST 4: Required/optional changed, position preserved ─────────────
    // atributo01 becomes required (optional: false), must stay in position 1
    const incomingOptionalChange = [
        { name: 'atributo01', optional: false, type: 'string' }, // was optional
        { name: 'atributo02', optional: true, type: 'string' },
        { name: 'atributo03', optional: true, type: 'string' },
    ];
    const expectedOptionalChange = [
        { name: 'atributo01', optional: false, type: 'string' }, // updated in-place
        { name: 'atributo02', optional: true, type: 'string' },
        { name: 'atributo03', optional: true, type: 'string' },
    ];
    assert(
        'TEST 4 — Required↔optional change applied in current position',
        mergeFields(existingFields, incomingOptionalChange),
        expectedOptionalChange
    );

    // ── TEST 5: New field added — must appear at the END ───────────────────
    const incomingNewField = [
        { name: 'atributo01', optional: true, type: 'string' },
        { name: 'atributo04', optional: true, type: 'boolean' }, // new, appears between 01 and 02 in spec
        { name: 'atributo02', optional: true, type: 'string' },
        { name: 'atributo03', optional: true, type: 'string' },
    ];
    const expectedNewField = [
        { name: 'atributo01', optional: true, type: 'string' },
        { name: 'atributo02', optional: true, type: 'string' },
        { name: 'atributo03', optional: true, type: 'string' },
        { name: 'atributo04', optional: true, type: 'boolean' }, // appended at end
    ];
    assert(
        'TEST 5 — New field appended at the end regardless of spec position',
        mergeFields(existingFields, incomingNewField),
        expectedNewField
    );

    // ── TEST 6: Field removed from spec — must be removed from output ────────
    const incomingRemoved = [
        { name: 'atributo01', optional: true, type: 'string' },
        // atributo02 removed from DTO
        { name: 'atributo03', optional: true, type: 'string' },
    ];
    const expectedRemoved = [
        { name: 'atributo01', optional: true, type: 'string' },
        { name: 'atributo03', optional: true, type: 'string' }, // atributo02 gone
    ];
    assert(
        'TEST 6 — Field removed from spec is deleted from output',
        mergeFields(existingFields, incomingRemoved),
        expectedRemoved
    );

    // ── Summary ───────────────────────────────────────────────────────────────────
    if (failed > 0) {
        console.error(`\n❌  Self-tests FAILED (${failed}/${passed + failed}). Generation aborted.\n`);
        process.exit(1);
    }
    console.log(`\n🧪 Self-tests passed (${passed}/${passed + failed}) — proceeding with generation...\n`);
}

// ─── Entry point ───────────────────────────────────────────────────────────────────
console.log('\n🔍 Running self-tests...');
runSelfTests();

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
