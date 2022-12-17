<script>
    import {
        Label,
        Input,
        Textarea,
        Button,
        Tabs,
        TabItem,
        Dropzone,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';
    import IngredientsModal from './ingredients-modal.svelte';

    const dispatch = createEventDispatcher();

    export let name = '';
    export let description = '';
    export let steps = [{ description: '' }];
    let images = [];
    export let selectedIngredients = [];
    export let title = '';

    export let ingredientMetadata = {};

    $: {
        for (const ingredientId of selectedIngredients.map(
            (ingredient) => ingredient.id
        )) {
            if (!ingredientMetadata[ingredientId]) {
                ingredientMetadata[ingredientId] = {
                    amount: 0,
                    unit: ''
                };
            }
        }
    }

    let ingredientsModalOpen = false;

    export let ingredients;

    let preview_image;

    $: {
        if (images.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                preview_image = reader.result;
            };
            reader.readAsDataURL(images[0]);
        }
    }

    $: addableIngredients = ingredients.filter(
        (ingredient) => !selectedIngredients.includes(ingredient)
    );

    async function saveRecipe() {
        dispatch('save', {
            name,
            description,
            steps,
            images,
            ingredients: Object.keys(ingredientMetadata).map((id) => ({
                ingredient: id,
                amount: Number(ingredientMetadata[id].amount),
                unit: ingredientMetadata[id].unit
            }))
        });
    }

    function addStep() {
        steps = [...steps, { description: '' }];
    }

    function selectIngredients(event) {
        selectedIngredients = [
            ...selectedIngredients,
            ...event.detail.ingredients
        ];
    }

    function removeIngredient(id) {
        selectedIngredients = selectedIngredients.filter(
            (ingredient) => ingredient.id !== id
        );
    }

    function newIngredient(event) {
        dispatch('newIngredient', event.detail);
    }
</script>

<form class="md:w-1/2 mx-auto">
    <h1
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
    >
        {title}
    </h1>
    <Tabs style="underline">
        <TabItem open>
            <span slot="title">Allgemein</span>

            <div class="mb-6">
                <Label for="recipe-name" class="mb-2">Rezept-Name</Label>
                <Input
                    bind:value={name}
                    type="text"
                    id="recipe-name"
                    placeholder="Ofengemüse mit Jackfruit und Zitronen-Kapern-Sauce"
                    required
                />
            </div>

            <div>
                <Label for="description" class="mb-2">Rezept-Beschreibung</Label
                >
                <Textarea
                    bind:value={description}
                    id="description"
                    placeholder="Kurze Beschreibung des Rezeptes"
                    rows="4"
                    name="description"
                />
            </div>

            <div>
                <Label for="dropzone" class="mb-2">Vorschaubild</Label>
                {#if preview_image}
                    <img
                        class="drop-shadow-md rounded-xl mb-4 w-32"
                        src={preview_image}
                        alt="Vorschaubild des Rezeptes"
                    />
                {/if}

                <Dropzone id="dropzone" bind:files={images}>
                    <svg
                        aria-hidden="true"
                        class="mb-3 w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        /></svg
                    >
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-semibold">Click to upload</span> or drag
                        and drop
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                </Dropzone>
            </div>
        </TabItem>

        <TabItem>
            <span slot="title">Arbeitsschritte</span>

            {#each steps as step, i}
                <div>
                    <Label for={'step-description-' + i} class="mb-2"
                        >{i + 1}. Arbeitsschritt</Label
                    >
                    <Textarea
                        bind:value={step.description}
                        id={'step-description-' + i}
                        placeholder="Schrittbeschreibung"
                        rows="4"
                        name="description"
                    />
                </div>
            {/each}

            <Button on:click={addStep}>Schritt hinzufügen</Button>
        </TabItem>

        <TabItem>
            <span slot="title">Zutaten</span>
            <Button on:click={() => (ingredientsModalOpen = true)}
                >Hinzufügen</Button
            >

            <IngredientsModal
                bind:open={ingredientsModalOpen}
                ingredients={addableIngredients}
                on:select={selectIngredients}
                on:newIngredient={newIngredient}
            />

            <Table>
                <TableHead>
                    <TableHeadCell>Menge</TableHeadCell>
                    <TableHeadCell>Einheit</TableHeadCell>
                    <TableHeadCell>Zutat</TableHeadCell>
                    <TableHeadCell>
                        <span class="sr-only"> Löschen </span>
                    </TableHeadCell>
                </TableHead>
                <TableBody class="divide-y">
                    {#each selectedIngredients as ingredient}
                        <TableBodyRow>
                            <TableBodyCell>
                                <Input
                                    type="number"
                                    id={'amount-' + ingredient.name}
                                    placeholder="1000"
                                    bind:value={ingredientMetadata[
                                        ingredient.id
                                    ].amount}
                                />
                            </TableBodyCell>
                            <TableBodyCell>
                                <Input
                                    placeholder="g"
                                    id={'unit-' + ingredient.name}
                                    bind:value={ingredientMetadata[
                                        ingredient.id
                                    ].unit}
                                />
                            </TableBodyCell>
                            <TableBodyCell>{ingredient.name}</TableBodyCell>
                            <TableBodyCell>
                                <button
                                    on:click={() =>
                                        removeIngredient(ingredient.id)}
                                    class="font-medium text-red-600 hover:underline dark:text-red-500"
                                >
                                    Löschen
                                </button>
                            </TableBodyCell>
                        </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
        </TabItem>
    </Tabs>

    <div class="mt-4">
        <Button on:click={saveRecipe}>Speichern</Button>
        <Button href="/" outline color="red">Abbrechen</Button>
    </div>
</form>
