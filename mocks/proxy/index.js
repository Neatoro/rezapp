const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(
    '/api',
    createProxyMiddleware({
        target: 'http://localhost:8080',
        pathRewrite: { '^/api': '' }
    })
);

app.listen(3111, () => {
    console.log('Proxy started on port 3111');
});
