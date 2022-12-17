import { env } from '$env/dynamic/private';

export async function load({ fetch }) {
    const response = await fetch(`${env.BACKEND_URL}/api/ingredient`);

    return await response.json();
}
