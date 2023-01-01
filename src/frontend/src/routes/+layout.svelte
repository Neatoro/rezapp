<script>
    import {
        NavBrand,
        Navbar,
        Toast,
        NavUl,
        NavLi,
        Toggle,
        Search
    } from 'flowbite-svelte';
    import '../app.postcss';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { messages } from '$lib/store';
    import { onMount } from 'svelte';
    import { beforeNavigate } from '$app/navigation';
    import { browser } from '$app/environment';
    import { writable } from 'svelte/store';

    export let data;

    let searchQuery = '';

    let initialDarkModeValue = true;
    if (browser) {
        const currentDarkModeSetting =
            localStorage.getItem('darkMode') || 'true';
        initialDarkModeValue = currentDarkModeSetting === 'true';
    }

    let darkMode = writable(initialDarkModeValue);
    darkMode.subscribe((value) => {
        if (browser) {
            document.documentElement.classList.toggle('dark', value);
            localStorage.setItem('darkMode', value);
        }
    });

    $: shouldShowContent = data.isAuthenticated || $page.route.id === '/login';

    beforeNavigate(({ to, cancel }) => {
        if (to.route.id === '/login') return;
        if (data.isAuthenticated) return;

        cancel();
    });

    onMount(() => {
        redirectToLoginIfUnauthenticated();
    });

    function redirectToLoginIfUnauthenticated() {
        if (!shouldShowContent) {
            goto('/login');
        }
    }

    function submitSearch(event) {
        event.preventDefault();
        goto(`/?search=${encodeURIComponent(searchQuery)}`);
    }
</script>

{#if shouldShowContent}
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
        {#if data.isAuthenticated}
            <form class="w-1/3" on:submit={submitSearch}>
                <Search
                    id="recipeSearch"
                    placeholder="Rezept suchen"
                    size="md"
                    bind:value={searchQuery}
                />
            </form>
        {/if}
        <NavUl>
            <NavLi>
                <Toggle id="darkModeToggle" bind:checked={$darkMode}>
                    {#if $darkMode}
                        Dunkel
                    {:else}
                        Hell
                    {/if}
                </Toggle>
            </NavLi>
            {#if data.isAuthenticated}
                <NavLi href="/auth/logout">Logout</NavLi>
            {/if}
        </NavUl>
    </Navbar>
    <main class="p-4">
        <slot />
    </main>
{/if}
