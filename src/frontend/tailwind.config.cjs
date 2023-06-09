const config = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
    ],
    theme: {
        extend: {
            colors: {
                'light-transparent': 'rgba(0, 0, 0, .1)',
                primary: {
                    50: '#f2fbf9',
                    100: '#d3f4ed',
                    200: '#a6e9db',
                    300: '#72d6c6',
                    400: '#44bdac',
                    500: '#2a9d8f',
                    600: '#208177',
                    700: '#1d6861',
                    800: '#1c534f',
                    900: '#1b4642',
                    950: '#0a2928'
                }
            }
        }
    },
    plugins: [require('flowbite/plugin')],
    darkMode: 'class'
};

module.exports = config;
