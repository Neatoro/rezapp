import { env } from '$env/dynamic/private';

function getSelectedLabels({ url }) {
    const query = url.searchParams;
    const labelsQuery = query.get('labels');
    const labels = labelsQuery ? labelsQuery.split(',') : [];
    return labels;
}

async function loadRecipes({ fetch, url }) {
    const query = url.searchParams;
    const search = query.get('search') || '';

    const labels = getSelectedLabels({ url });

    const response = await fetch(
        `${env.BACKEND_URL}/api/recipe?search=${encodeURIComponent(
            search
        )}&labels=${encodeURIComponent(labels.join(','))}`
    );
    const data = await response.json();
    return data.recipes;
}

async function loadLabels({ fetch }) {
    const response = await fetch(`${env.BACKEND_URL}/api/label`);
    const data = await response.json();

    return data.labels;
}

export async function load({ fetch, url }) {
    const labels = await loadLabels({ fetch });
    const recipes = await loadRecipes({ fetch, url });

    return {
        recipes,
        labels,
        selectedLabels: getSelectedLabels({ url }),
        search: url.searchParams.get('search') || ''
    };
}
