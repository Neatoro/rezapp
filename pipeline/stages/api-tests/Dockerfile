FROM node:18-alpine

WORKDIR /tests

COPY integration-tests/api-tests /tests
RUN npm ci

ENV DATABASE_PATH=/database/recipes.db
ENV BACKEND_BASE_URL=http://rezapp-backend:8080

CMD [ "npm", "start" ]
