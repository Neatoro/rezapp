export async function load({ params, fetch }) {
    const response = await fetch(`/api/recipe/${params.id}`);

    return {
        recipe: await response.json()
    };
}
