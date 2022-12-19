module.exports = {
    changeAuthState(state = {}) {
        const baseUrl = process.env.PROXY_MOCK_URL || 'http://localhost:3111';
        return fetch(`${baseUrl}/mock/auth-state`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(state)
        });
    }
};
