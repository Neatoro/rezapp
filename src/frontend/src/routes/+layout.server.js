import { env } from '$env/dynamic/private';

export const load = async ({ fetch }) => {
    const response = await fetch(`${env.AUTH_PROVIDER_URL}/profile`);
    const data = await response.json();
    return {
        isAuthenticated: data.isAuthenticated
    };
};
