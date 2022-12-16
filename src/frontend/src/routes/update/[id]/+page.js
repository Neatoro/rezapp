async function loadRecipe(id, fetch) {
    const response = await fetch(`/api/recipe/${id}`);

    return await response.json();
}

async function loadIngredients(fetch) {
    const response = await fetch('/api/ingredient');
    const data = await response.json();

    return data.ingredients;
}

export async function load({ params, fetch }) {
    return {
        recipe: await loadRecipe(params.id, fetch),
        ingredients: await loadIngredients(fetch)
    };
}
