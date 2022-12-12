<script>
    import { P, SpeedDial, SpeedDialButton } from 'flowbite-svelte';
    import { goto } from '$app/navigation';

    export let data;

    async function deleteRecipe() {
        await fetch(`/api/recipe/${data.recipe.id}`, {
            method: 'DELETE'
        });
        goto('/');
    }
</script>

<div class="md:w-1/2 mx-auto">
    {#if data.recipe.image}
        <img
            class="drop-shadow-md rounded-xl max-h-72 mx-auto mb-4"
            src={`/api/recipe/${data.recipe.id}/image`}
            alt={data.recipe.name}
        />
    {/if}

    <h1
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
    >
        {data.recipe.name}
    </h1>

    <P>{data.recipe.description}</P>

    <section class="mt-8">
        <h2
            class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
            Arbeitsschritte
        </h2>

        {#each data.recipe.steps as step}
            <P class="my-2">{step.description}</P>
        {/each}
    </section>
</div>

<SpeedDial defaultClass="fixed right-6 bottom-6" pill={false}>
    <SpeedDialButton on:click={deleteRecipe} name="Löschen">
        <svg class="icon icon-bin"
            ><use xlink:href="/icons.svg#icon-bin" /></svg
        >
    </SpeedDialButton>
</SpeedDial>
