<script>
    import { goto } from '$app/navigation';
    import Editor from '$lib/components/editor.svelte';

    export let data;

    async function saveRecipe({ detail }) {
        const { name, description, steps, images, ingredients } = detail;
        const response = await fetch(`/api/recipe/${data.recipe.id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                ingredients,
                steps: steps.filter((step) => step.description !== '')
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

        goto(`/view/${data.recipe.id}`);
    }

    function newIngredient(event) {
        data.ingredients = [...data.ingredients, event.detail];
    }

    function transformToSelectedIngredients() {
        return data.recipe.ingredients.map(({ ingredient }) => ({
            id: ingredient.id,
            name: ingredient.name
        }));
    }

    function transformToIngredientMetadata() {
        return data.recipe.ingredients.reduce(
            (acc, current) => ({
                ...acc,
                [current.ingredient.id]: {
                    amount: current.amount,
                    unit: current.unit
                }
            }),
            {}
        );
    }
</script>

<Editor
    on:save={saveRecipe}
    title="Rezept ändern"
    ingredients={data.ingredients}
    name={data.recipe.name}
    description={data.recipe.description}
    steps={data.recipe.steps}
    selectedIngredients={transformToSelectedIngredients()}
    ingredientMetadata={transformToIngredientMetadata()}
    on:newIngredient={newIngredient}
/>
