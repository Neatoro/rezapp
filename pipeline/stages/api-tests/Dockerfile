FROM node:18-alpine

WORKDIR /tests/shared

COPY integration-tests/shared /tests/shared
RUN npm ci

WORKDIR /tests/api-tests

COPY integration-tests/api-tests /tests/api-tests
RUN npm ci

ENV DATABASE_PATH=/database/recipes.db
ENV BACKEND_BASE_URL=http://rezapp-backend:8080

CMD [ "npm", "start" ]
