import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

export function request({ fetch, url, options }) {
    const backend = dev ? 'http://localhost:5173' : env.BACKEND_URL;
    return fetch(`${backend}${url}`, options);
}
