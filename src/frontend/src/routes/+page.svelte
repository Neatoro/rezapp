<script>
    import {
        Button,
        Badge,
        Card,
        Toolbar,
        Chevron,
        Dropdown,
        Checkbox,
        Pagination
    } from 'flowbite-svelte';
    import { badgeColor } from '$lib/badge-color';
    import { goto } from '$app/navigation';

    export let data;

    let page = 0;
    const maxItems = 12;
    $: pageHelper = {
        prev: page !== 0,
        next: page < Math.ceil(data.recipes.length / maxItems) - 1,
        start: page * maxItems,
        end: page * maxItems + maxItems,
        max: Math.ceil(data.recipes.length / maxItems)
    };

    let labelState = data.labels.reduce(
        (acc, current) => ({
            ...acc,
            [current.id]: data.selectedLabels.includes(current.id)
        }),
        {}
    );

    function applyLabelFilters() {
        const labels = Object.keys(labelState).filter((id) => labelState[id]);
        goto(`/?search=${data.search}&labels=${labels.join(',')}`);
    }

    function nextRecipes() {
        if (pageHelper.next) {
            page++;
        }
    }

    function previousRecipes() {
        if (pageHelper.prev) {
            page--;
        }
    }
</script>

<Toolbar>
    <Button href="/create"
        ><svg class="icon icon-plus"
            ><use xlink:href="icons.svg#icon-plus" /></svg
        ><span class="sr-only">Neues Rezept</span></Button
    >
    <div class="ml-4">
        <Button><Chevron>Kategorien</Chevron></Button>
        <Dropdown class="w-60 p-3 space-y-1 text-sm">
            <div slot="header" class="p-3">
                <Button on:click={applyLabelFilters}>Anwenden</Button>
            </div>
            {#each data.labels as label}
                <li
                    class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <Checkbox bind:checked={labelState[label.id]}
                        ><Badge class="mr-2" color={badgeColor(label.color)}
                            >{label.name}</Badge
                        ></Checkbox
                    >
                </li>
            {/each}
        </Dropdown>
    </div>
</Toolbar>

<div class="flex flex-col grow">
    <div
        class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 my-4 space-around"
    >
        {#each data.recipes.slice(pageHelper.start, pageHelper.end) as recipe}
            <Card
                img={recipe.image ? `/api/recipe/${recipe.id}/image` : ''}
                class="width: 100%"
            >
                <h5
                    class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                >
                    {recipe.name}
                </h5>
                {#if recipe.labels.length > 0}
                    <div class="labels mt-2">
                        {#each recipe.labels as label}
                            <Badge class="mr-2" color={badgeColor(label.color)}
                                >{label.name}</Badge
                            >
                        {/each}
                    </div>
                {/if}
                <p
                    class="mt-2 font-normal text-gray-700 dark:text-gray-400 leading-tight"
                >
                    {recipe.description}
                </p>

                <Button class="mt-4 w-fit" href={'/view/' + recipe.id}
                    >Anzeigen</Button
                >
            </Card>
        {/each}
    </div>
    {#if data.recipes.length > 12}
        <div
            class="grid grid-cols-3 grid-rows-2 py-4 mt-auto bg-white dark:bg-gray-900"
        >
            <div
                class="col-start-2 flex justify-center text-sm text-gray-700 dark:text-gray-400"
                id="pagenation-info"
            >
                Seite {page + 1} von {pageHelper.max}
            </div>
            <div class="col-start-2 flex justify-center">
                <Pagination on:previous={previousRecipes} on:next={nextRecipes}>
                    <span slot="prev">Vorherig</span>
                    <span slot="next">Nächste</span>
                </Pagination>
            </div>
        </div>
    {/if}
</div>
