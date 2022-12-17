import { env } from '$env/dynamic/private';

export async function load({ params, fetch }) {
    const response = await fetch(`${env.BACKEND_URL}/api/recipe/${params.id}`);

    return {
        recipe: await response.json()
    };
}
