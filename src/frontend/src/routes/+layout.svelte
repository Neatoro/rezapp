<script>
    import { NavBrand, Navbar, Toast } from 'flowbite-svelte';
    import '../app.postcss';

    import { messages } from '$lib/store';
</script>

{#each $messages as message}
    <Toast color={message.color} class="mb-2" position="top-right">
        <svelte:fragment slot="icon">
            <svg class="icon icon-{message.icon}"
                ><use xlink:href="/icons.svg#icon-{message.icon}" /></svg
            >
        </svelte:fragment>
        {message.text}
    </Toast>
{/each}

<Navbar>
    <NavBrand href="/">
        <span
            class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
        >
            Rezapp
        </span>
    </NavBrand>
</Navbar>
<main class="p-4">
    <slot />
</main>
