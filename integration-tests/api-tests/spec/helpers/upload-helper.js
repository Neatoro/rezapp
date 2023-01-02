const FormData = require('form-data');
const fs = require('fs');

const baseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:8080';

module.exports = async function upload(url, config, path) {
    const file = fs.createReadStream(path);
    const form = new FormData();
    form.append('file', file);

    const { default: fetch } = await import('node-fetch');
    return await fetch(`${baseUrl}${url}`, {
        ...config,
        body: form
    });
};
