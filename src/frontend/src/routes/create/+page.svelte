<script>
    import { Label, Input, Textarea, Button } from 'flowbite-svelte';
    import { goto } from '$app/navigation';

    let name = '';
    let description = '';

    async function saveRecipe() {
        await fetch('/api/recipe', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description
            })
        });

        goto('/');
    }
</script>

<form>
    <h1 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Neues Rezept anlegen</h1>
    <div class="mb-6">
        <Label for="name" class="mb-2">Rezept-Name</Label>
        <Input bind:value={name} type="text" id="name" placeholder="Ofengemüse mit Jackfruit und Zitronen-Kapern-Sauce" required />
    </div>

    <div class="mb-6">
        <Label for="description" class="mb-2">Rezept-Beschreibung</Label>
        <Textarea bind:value={description} id="description" placeholder="Kurze Beschreibung des Rezeptes" rows="4" name="description"/>
    </div>

    <Button on:click={saveRecipe}>Speichern</Button>
    <Button href="/" outline color="red">Abbrechen</Button>
</form>
