const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const helmet = require('helmet');
const { auth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: false,
    secret: process.env.GOOGLE_SECRET,
    baseURL: process.env.GOOGLE_BASE_URL,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    issuerBaseURL: 'https://accounts.google.com',
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email'
    }
};

const app = express();

app.use(helmet());
app.use('/auth', auth(config));

app.get('/auth/profile', async (request, response) => {
    if (request.oidc.isAuthenticated()) {
        response.json({
            isAuthenticated: true,
            user: request.oidc.user
        });
    } else {
        response.status(401).json({
            isAuthenticated: false
        });
    }
});

app.listen(3222, () => console.log('Auth Provider started on :3222'));
