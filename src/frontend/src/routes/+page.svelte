<script>
    import { Card } from 'flowbite-svelte';

    export let data;
</script>

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
