<script>
    import { NavBrand, Navbar } from 'flowbite-svelte';
    import '../app.postcss';
</script>

<Navbar let:hidden let:toggle>
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
