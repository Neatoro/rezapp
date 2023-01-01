import { env } from '$env/dynamic/private';

async function loadIngredients({ fetch }) {
    const response = await fetch(`${env.BACKEND_URL}/api/ingredient`);
    return (await response.json()).ingredients;
}

async function loadLabels({ fetch }) {
    const response = await fetch(`${env.BACKEND_URL}/api/label`);
    return (await response.json()).labels;
}

export async function load({ fetch }) {
    const ingredients = await loadIngredients({ fetch });
    const labels = await loadLabels({ fetch });

    return {
        ingredients,
        labels
    };
}
