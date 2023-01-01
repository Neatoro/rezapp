<script>
    import { _ } from 'svelte-i18n';
    import { goto } from '$app/navigation';
    import Editor from '$lib/components/editor.svelte';
    import { Toast } from 'flowbite-svelte';
    import { toastMessage } from '$lib/store';

    export let data;

    let errors = [];

    async function save({ detail }) {
        try {
            const recipe = await saveRecipe(detail);
            await saveImage({ id: recipe.id, images: detail.images });
            toastMessage({
                text: 'Rezept wurde erfolgreich geändert!',
                icon: 'checkmark',
                color: 'green'
            });
            goto(`/view/${data.recipe.id}`);
        } catch (e) {
            errors = [...errors, e.message];
            setTimeout(() => {
                errors = errors.filter((message) => message !== e.message);
            }, 4000);
        }
    }

    async function saveRecipe({
        name,
        description,
        steps,
        ingredients,
        labels,
        portions
    }) {
        const response = await fetch(`/api/recipe/${data.recipe.id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                ingredients,
                labels,
                portions,
                steps: steps.filter((step) => step.description !== '')
            })
        });

        if (response.status !== 200) {
            throw new Error('recipe.save_failed');
        }

        return await response.json();
    }

    async function saveImage({ id, images }) {
        if (images.length > 0) {
            const image = images[0];
            const formData = new FormData();
            formData.append('file', image);

            const response = await fetch(`/api/recipe/${id}/image`, {
                method: 'PUT',
                body: formData
            });

            if (response.status !== 200) {
                throw new Error('image.upload_failed');
            }
        }
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

{#each errors as error}
    <Toast color="red" class="mb-2" position="top-right">
        <svelte:fragment slot="icon">
            <svg class="icon icon-cross"
                ><use xlink:href="/icons.svg#icon-cross" /></svg
            >
        </svelte:fragment>
        {$_(error)}
    </Toast>
{/each}

<Editor
    on:save={save}
    title="Rezept ändern"
    ingredients={data.ingredients}
    labels={data.labels}
    name={data.recipe.name}
    description={data.recipe.description}
    steps={data.recipe.steps}
    portions={data.recipe.portions}
    selectedIngredients={transformToSelectedIngredients()}
    selectedLabels={data.recipe.labels}
    ingredientMetadata={transformToIngredientMetadata()}
    on:newIngredient={newIngredient}
/>
