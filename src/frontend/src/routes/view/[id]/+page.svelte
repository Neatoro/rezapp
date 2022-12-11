<script>
    import { P } from 'flowbite-svelte';

    export let data;
</script>

<div class="md:w-1/2 mx-auto">
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
