export async function load({ fetch }) {
    const response = await fetch('/api/ingredient');

    return await response.json();
}
