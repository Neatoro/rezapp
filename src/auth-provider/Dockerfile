FROM node:18-alpine

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY index.js .
COPY otel.js .

CMD [ "npm", "start" ]
