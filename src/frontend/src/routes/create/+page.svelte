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
                text: 'Rezept wurde erfolgreich angelegt!',
                icon: 'checkmark',
                color: 'green'
            });
            goto('/');
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
        portions
    }) {
        const response = await fetch('/api/recipe', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                portions,
                ingredients,
                steps: steps.filter((step) => step.description !== '')
            })
        });

        if (response.status !== 201) {
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
    ingredients={data.ingredients}
    title="Neues Rezept anlegen"
    on:newIngredient={newIngredient}
/>
