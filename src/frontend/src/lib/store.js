import { writable } from 'svelte/store';

export const messages = writable([]);

export function toastMessage(message) {
    messages.update((state) => [...state, message]);
    setTimeout(() => {
        messages.update((state) => state.filter((m) => m !== message));
    }, 5000);
}
