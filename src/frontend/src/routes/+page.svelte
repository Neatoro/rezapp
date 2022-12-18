<script>
    import { Button, Card, Toolbar } from 'flowbite-svelte';

    export let data;
</script>

<Toolbar>
    <Button href="/create"
        ><svg class="icon icon-plus"
            ><use xlink:href="icons.svg#icon-plus" /></svg
        ><span class="sr-only">Neues Rezept</span></Button
    >
</Toolbar>

<div
    class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 my-4"
>
    {#each data.recipes as recipe}
        <Card img={recipe.image ? `/api/recipe/${recipe.id}/image` : ''}>
            <h5
                class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
                {recipe.name}
            </h5>
            <p
                class="font-normal text-gray-700 dark:text-gray-400 leading-tight"
            >
                {recipe.description}
            </p>

            <Button class="mt-4 w-fit" href={'/view/' + recipe.id}
                >Anzeigen</Button
            >
        </Card>
    {/each}
</div>
