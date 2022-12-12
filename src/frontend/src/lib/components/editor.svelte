<script>
    import {
        Label,
        Input,
        Textarea,
        Button,
        Tabs,
        TabItem,
        Dropzone
    } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let name = '';
    let description = '';
    let steps = [{ description: '' }];
    let images = [];

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

    async function saveRecipe() {
        dispatch('save', {
            name,
            description,
            steps,
            images
        });
    }

    function addStep() {
        steps = [...steps, { description: '' }];
    }
</script>

<form class="md:w-1/2 mx-auto">
    <h1
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
    >
        Neues Rezept anlegen
    </h1>
    <Tabs style="underline">
        <TabItem open>
            <span slot="title">Allgemein</span>

            <div class="mb-6">
                <Label for="name" class="mb-2">Rezept-Name</Label>
                <Input
                    bind:value={name}
                    type="text"
                    id="name"
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
                    <Label for="description" class="mb-2"
                        >{i + 1}. Arbeitsschritt</Label
                    >
                    <Textarea
                        bind:value={step.description}
                        id="description"
                        placeholder="Schrittbeschreibung"
                        rows="4"
                        name="description"
                    />
                </div>
            {/each}

            <Button on:click={addStep}>Schritt hinzufügen</Button>
        </TabItem>
    </Tabs>

    <div class="mt-4">
        <Button on:click={saveRecipe}>Speichern</Button>
        <Button href="/" outline color="red">Abbrechen</Button>
    </div>
</form>
