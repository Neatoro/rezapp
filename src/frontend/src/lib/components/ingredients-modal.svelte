<script>
    import {
        Modal,
        Pagination,
        Button,
        TableBody,
        TableBodyCell,
        TableHeadCell,
        TableHead,
        TableBodyRow,
        Checkbox,
        TableSearch
    } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';
    import CreateIngredientModal from './create-ingredient-modal.svelte';

    const dispatch = createEventDispatcher();

    let newIngredientModalOpen = false;

    export let open = false;
    export let ingredients;

    const ingredientsPerPage = 5;

    let searchQuery = '';
    let page = 0;
    let pageHelper;

    let selection = {};

    $: selectedIds = Object.keys(selection).filter((id) => selection[id]);

    $: filteredItems = ingredients.filter(
        (item) =>
            item.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
    );

    $: searchQuery, (page = 0);

    $: {
        pageHelper = {
            max: filteredItems.length,
            start: Math.max(page * ingredientsPerPage, 0),
            end: Math.min(
                page * ingredientsPerPage + ingredientsPerPage,
                filteredItems.length
            ),
            next: (page + 1) * ingredientsPerPage <= filteredItems.length,
            prev: page !== 0
        };
        pageHelper.fillers =
            ingredientsPerPage -
            filteredItems.slice(pageHelper.start, pageHelper.end).length;
    }

    function nextIngredients() {
        if (pageHelper.next) {
            page++;
        }
    }

    function previousIngredients() {
        if (pageHelper.prev) {
            page--;
        }
    }

    function selectIngredients() {
        dispatch('select', {
            ingredients: ingredients.filter((ingredient) =>
                selectedIds.includes(ingredient.id)
            )
        });
        open = false;
    }

    function newIngredient(event) {
        dispatch('newIngredient', event.detail);
    }
</script>

<Modal title="Zutaten hinzufügen" bind:open>
    <Button on:click={() => (newIngredientModalOpen = true)}
        >Neue Zutat erstellen</Button
    >
    <TableSearch striped={true} bind:inputValue={searchQuery}>
        <TableHead>
            <TableHeadCell><span class="sr-only">Auswählen</span></TableHeadCell
            >
            <TableHeadCell>Zutat</TableHeadCell>
        </TableHead>
        <TableBody class="divide-y">
            {#each filteredItems.slice(pageHelper.start, pageHelper.end) as ingredient}
                <TableBodyRow>
                    <TableBodyCell
                        ><Checkbox
                            bind:checked={selection[ingredient.id]}
                        /></TableBodyCell
                    >
                    <TableBodyCell>{ingredient.name}</TableBodyCell>
                </TableBodyRow>
            {/each}
            {#each Array(pageHelper.fillers) as _}
                <TableBodyRow>
                    <TableBodyCell
                        ><Checkbox disabled class="invisible " /></TableBodyCell
                    >
                    <TableBodyCell />
                </TableBodyRow>
            {/each}
        </TableBody>
    </TableSearch>
    <div class="text-sm text-gray-700 dark:text-gray-400">
        Showing <span class="font-semibold text-gray-900 dark:text-white"
            >{pageHelper.start + 1}</span
        >
        to
        <span class="font-semibold text-gray-900 dark:text-white"
            >{pageHelper.end}</span
        >
        of
        <span class="font-semibold text-gray-900 dark:text-white"
            >{pageHelper.max}</span
        > Entries
    </div>

    <Pagination
        table
        on:previous={previousIngredients}
        on:next={nextIngredients}
    >
        <span slot="prev">Prev</span>
        <span slot="next">Next</span>
    </Pagination>
    <svelte:fragment slot="footer">
        <Button on:click={selectIngredients}>Auswählen</Button>
        <Button outline color="red" on:click={() => (open = false)}
            >Abbrechen</Button
        >
    </svelte:fragment>
</Modal>

<CreateIngredientModal
    bind:open={newIngredientModalOpen}
    on:created={newIngredient}
/>
