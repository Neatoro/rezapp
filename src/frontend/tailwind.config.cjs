const config = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
    ],
    theme: {
        extend: {
            colors: {
                'light-transparent': 'rgba(0, 0, 0, .1)'
            }
        }
    },
    plugins: [require('flowbite/plugin')],
    darkMode: 'class'
};

module.exports = config;
