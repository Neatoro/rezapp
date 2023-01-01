<script>
    import {
        Input,
        Label,
        Modal,
        Button,
        Select,
        Badge
    } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';
    import { badgeColor } from '$lib/badge-color';

    const dispatch = createEventDispatcher();

    const colors = [
        { value: 'blue', name: 'Blau' },
        { value: 'dark', name: 'Grau' },
        { value: 'red', name: 'Rot' },
        { value: 'green', name: 'Grün' },
        { value: 'yellow', name: 'Gelb' },
        { value: 'indigo', name: 'Indigo' },
        { value: 'purple', name: 'Lila' },
        { value: 'pink', name: 'Pink' }
    ];

    export let open = false;
    let name;
    let color = 'blue';

    async function createLabel() {
        const response = await fetch('/api/label', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                color
            })
        });

        dispatch('created', await response.json());
    }
</script>

<Modal
    id="modalCreateLabel"
    bind:open
    title="Neue Kategorie erstellen"
    autoclose
>
    <form>
        <div class="mb-4">
            <Badge color={badgeColor(color)}>{name}</Badge>
        </div>
        <div class="mb-6">
            <Label for="name" class="mb-2">Name</Label>
            <Input
                bind:value={name}
                type="text"
                id="name"
                placeholder="Vegan"
                required
            />
        </div>
        <div class="mb-6">
            <Label for="color" class="mb-2">Color</Label>
            <Select
                id="color"
                bind:value={color}
                items={colors}
                placeholder="Wähle eine Farbe"
            />
        </div>
    </form>
    <svelte:fragment slot="footer">
        <Button on:click={createLabel}>Erstellen</Button>
        <Button outline color="red">Abbrechen</Button>
    </svelte:fragment>
</Modal>
