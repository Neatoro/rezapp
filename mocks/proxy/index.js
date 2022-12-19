const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const defaultState = {
    isAuthenticated: true,
    user: {
        sub: '0123456789'
    }
};

let authState = defaultState;

const app = express();
app.use(express.json());

app.use(
    '/api',
    createProxyMiddleware({
        target: 'http://localhost:8080',
        pathRewrite: { '^/api': '' }
    })
);

app.get('/auth/profile', (request, response) => {
    response.json(authState);
});

app.put('/mock/auth-state', (request, response) => {
    authState =
        Object.keys(request.body).length === 0 ? defaultState : request.body;
    response.status(201).json(authState);
});

app.listen(3111, () => {
    console.log('Proxy started on port 3111');
});
