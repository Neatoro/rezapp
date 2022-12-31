import { env } from '$env/dynamic/private';

export async function load({ fetch, url }) {
    const query = url.searchParams;
    const search = query.get('search') || '';

    const response = await fetch(
        `${env.BACKEND_URL}/api/recipe?search=${encodeURIComponent(search)}`
    );
    const data = await response.json();

    return data;
}
