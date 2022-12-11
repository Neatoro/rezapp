<script>
    import { Button, Card, Toolbar } from 'flowbite-svelte';

    export let data;
</script>

<Toolbar>
    <Button href="/create"><svg class="icon icon-plus"><use xlink:href="icons.svg#icon-plus"></use></svg></Button>
</Toolbar>

<div class="my-4">
    {#each data.recipes as recipe}
    <Card>
        <h5
            class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
            {recipe.name}
        </h5>
        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
            {recipe.description}
        </p>
    </Card>
    {/each}
</div>
