module.exports = function executeRequest(url, options) {
    const baseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:8080';
    return fetch(`${baseUrl}${url}`, options);
};
