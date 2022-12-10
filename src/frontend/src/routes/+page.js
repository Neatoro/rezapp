export async function load({ fetch }) {
    const response = await fetch('/api/recipe');
    const data = await response.json();

    return data;
}
