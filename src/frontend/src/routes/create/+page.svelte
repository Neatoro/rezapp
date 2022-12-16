<script>
    import { goto } from '$app/navigation';
    import Editor from '$lib/components/editor.svelte';

    export let data;

    async function saveRecipe({ detail }) {
        const { name, description, steps, images, ingredients } = detail;
        const response = await fetch('/api/recipe', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                ingredients,
                steps: steps
                    .filter((step) => step.description !== '')
            })
        });

        if (images.length > 0) {
            const recipe = await response.json();
            const image = images[0];
            const formData = new FormData();
            formData.append('file', image);

            await fetch(`/api/recipe/${recipe.id}/image`, {
                method: 'PUT',
                body: formData
            });
        }

        goto('/');
    }

    function newIngredient(event) {
        data.ingredients = [...data.ingredients, event.detail];
    }
</script>

<Editor
    on:save={saveRecipe}
    ingredients={data.ingredients}
    on:newIngredient={newIngredient}
/>
