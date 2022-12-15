import preprocess from 'svelte-preprocess';
import adapter from 'svelte-adapter-deno';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter()
    },

    preprocess: [
        preprocess({
            postcss: true
        })
    ]
};

export default config;
