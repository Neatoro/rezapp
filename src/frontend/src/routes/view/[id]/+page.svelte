<script>
    import {
        Modal,
        P,
        SpeedDial,
        SpeedDialButton,
        Badge,
        Button,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from 'flowbite-svelte';
    import { goto } from '$app/navigation';
    import { badgeColor } from '$lib/badge-color';

    export let data;

    let deleteModal = false;

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

    <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {data.recipe.name}
    </h1>

    {#if data.recipe.labels.length > 0}
        <div class="labels mt-4">
            {#each data.recipe.labels as label}
                <Badge class="mr-2" color={badgeColor(label.color)}
                    >{label.name}</Badge
                >
            {/each}
        </div>
    {/if}

    <P class="mt-4">{data.recipe.description}</P>
    {#if data.recipe.portions !== 0}
        <P class="mt-4">Portionen: {data.recipe.portions}</P>
    {/if}

    <section class="mt-8">
        <h2
            class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
            Zutaten
        </h2>

        <Table>
            <TableHead>
                <TableHeadCell>Menge</TableHeadCell>
                <TableHeadCell>Zutat</TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">
                {#each data.recipe.ingredients as recipeIngredient}
                    <TableBodyRow>
                        <TableBodyCell
                            >{#if recipeIngredient.amount > 0}{recipeIngredient.amount}
                            {/if}{recipeIngredient.unit}</TableBodyCell
                        >
                        <TableBodyCell
                            >{recipeIngredient.ingredient.name}</TableBodyCell
                        >
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    </section>

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
    <SpeedDialButton on:click={() => (deleteModal = true)} name="Löschen">
        <svg class="icon icon-bin"><use xlink:href="/icons.svg#icon-bin" /></svg
        >
    </SpeedDialButton>
    <SpeedDialButton
        on:click={() => goto(`/update/${data.recipe.id}`)}
        name="Bearbeiten"
    >
        <svg class="icon icon-pencil"
            ><use xlink:href="/icons.svg#icon-pencil" /></svg
        >
    </SpeedDialButton>
</SpeedDial>

<Modal title="Löschen" bind:open={deleteModal} autoclose>
    <P>Möchtest du das Rezept "{data.recipe.name}" wirklich löschen?</P>
    <svelte:fragment slot="footer">
        <Button>Abbrechen</Button>
        <Button color="red" on:click={deleteRecipe}>Löschen</Button>
    </svelte:fragment>
</Modal>
