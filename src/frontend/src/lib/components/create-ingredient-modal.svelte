<script>
    import { Input, Label, Modal, Button } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let open = false;
    let name;

    async function createIngredient() {
        const response = await fetch('/api/ingredient', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name
            })
        });

        dispatch('created', await response.json());
    }
</script>

<Modal id="modalCreateIngredient" bind:open title="Neue Zutat erstellen" autoclose>
    <form>
        <div class="mb-6">
            <Label for="name" class="mb-2">Name</Label>
            <Input
                bind:value={name}
                type="text"
                id="name"
                placeholder="Jackfruit"
                required
            />
        </div>
    </form>
    <svelte:fragment slot="footer">
        <Button on:click={createIngredient}>Erstellen</Button>
        <Button outline color="red">Abbrechen</Button>
    </svelte:fragment>
</Modal>
