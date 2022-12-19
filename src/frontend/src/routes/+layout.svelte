<script>
    import { NavBrand, Navbar, Toast, NavUl, NavLi } from 'flowbite-svelte';
    import '../app.postcss';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { messages } from '$lib/store';
    import { onMount } from 'svelte';
    import { beforeNavigate } from '$app/navigation';

    export let data;

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
        <NavUl>
            <NavLi href="/auth/logout">Logout</NavLi>
        </NavUl>
    </Navbar>
    <main class="p-4">
        <slot />
    </main>
{/if}
