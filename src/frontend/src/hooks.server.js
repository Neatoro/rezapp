import { locale } from 'svelte-i18n';
import { RandomIdGenerator } from '@opentelemetry/sdk-trace-base';

const randomGenerator = new RandomIdGenerator();

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
        const id = randomGenerator.generateSpanId();
        const newParent = parent.replace(
            /([0-9]{2})-([0-9a-zA-Z]+)-([0-9a-zA-Z]+)-([0-9]{2})/,
            `$1-$2-${id}-$4`
        );
        request.headers.set('traceparent', newParent);
    }

    request.headers.set('cookie', event.request.headers.get('cookie'));

    return fetch(request);
}
