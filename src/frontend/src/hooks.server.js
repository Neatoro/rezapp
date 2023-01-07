import { locale } from 'svelte-i18n';

export const handle = async ({ event, resolve }) => {
    const lang = event.request.headers.get('accept-language')?.split(',')[0];
    if (lang) {
        locale.set(lang);
    }
    return resolve(event);
};

export async function handleFetch({ event, request, fetch }) {
    if (event.request.headers.has('traceparent')) {
        const parent = event.request.headers.get('traceparent');
        request.headers.set('traceparent', parent);
    }

    request.headers.set('cookie', event.request.headers.get('cookie'));

    return fetch(request);
}
