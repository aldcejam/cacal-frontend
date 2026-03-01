import axios, { type Method, } from "axios";
import { toast } from "react-toastify";
import { isBlob } from "../utils/isBlob";
import { useAuthStore } from "../../stores/useAuthStore";

export interface GerarServiceProps<BODY = object | FormData, QUERY = Record<string, any>> {
    endpoint: string;
    method: Method;
    contentType?: 'application/json' | 'multipart/form-data';
    options?: {
        headers?: Record<string, string>;
        body?: BODY;
        query?: QUERY;
    };
}

export async function gerarService<RESPONSE = undefined>({ endpoint, method, contentType = 'application/json', options }: GerarServiceProps): Promise<RESPONSE> {
    if (options?.body && contentType === 'multipart/form-data') options.body = gerarFormData(options.body);
    if (endpoint.startsWith('/')) endpoint = endpoint.substring(1);

    const hasArray = Object.values(options?.query || {}).some(Array.isArray);

    return (await api.request<RESPONSE>({
        url: endpoint,
        method,
        headers: {
            ...api.defaults.headers.common,
            ...options?.headers,
            "Content-Type": contentType,
        },
        data: options?.body,
        params: options?.query,
        ...(hasArray && {
            paramsSerializer: params => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach(v => queryParams.append(key, v));
                    } else if (value !== undefined && value !== null) {
                        queryParams.append(key, String(value));
                    }
                });
                return queryParams.toString();
            }
        }),
        withCredentials: true,
    })).data;
}

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? `${window.location.origin}/api` : import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8080/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Origem': 'web',
    },
    withCredentials: true,
});

api.interceptors.response.use(response => response, error => {
    if (error.response?.status === 400) {
        if (!error.response.data.detail) {
            toast.error(error.response.data.detail);
        }
        return Promise.reject(error.response.data);
    }
    if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        toast.error('Sessão expirada, faça login novamente');
        if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login';
        }
    }
    if (error.response?.status === 403) {
        toast.error('Você não tem permissão para realizar esta ação');
    }
    return Promise.reject(error);
});

export const gerarFormData = (body: Object): FormData | undefined => {
    const formData = new FormData();

    const process = (key: string, value: any) => {
        if (typeof value === 'string' || isBlob(value)) {
            formData.append(key, value);
        } else {
            formData.append(key, JSON.stringify(value));
        }
    };

    Object.entries(body)
        .filter(([_, value]) => isDefined(value))
        .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => process(key, v));
            } else {
                process(key, value);
            }
        });

    return formData;
};

export const isDefined = <T>(value: T | null | undefined): value is Exclude<T, null | undefined> => {
    return value !== undefined && value !== null;
};
