<script>
    import { Label, Input, Textarea, Button, Tabs, TabItem } from 'flowbite-svelte';
    import { goto } from '$app/navigation';

    let name = '';
    let description = '';
    let steps = [{ description: '' }];

    async function saveRecipe() {
        await fetch('/api/recipe', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                steps: steps
                    .filter((step) => step.description !== '')
                    .map((step) => step.description)
            })
        });

        goto('/');
    }

    function addStep() {
        steps = [
            ...steps,
            { description: '' }
        ];
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
                <Label for="description" class="mb-2">Rezept-Beschreibung</Label>
                <Textarea
                    bind:value={description}
                    id="description"
                    placeholder="Kurze Beschreibung des Rezeptes"
                    rows="4"
                    name="description"
                />
            </div>
        </TabItem>

        <TabItem>
            <span slot="title">Arbeitsschritte</span>

            {#each steps as step, i }
            <div>
                <Label for="description" class="mb-2">{i + 1}. Arbeitsschritt</Label>
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
