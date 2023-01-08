FROM node:18-alpine as build

WORKDIR /build

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /build/build .
COPY --from=build /build/otel-server .
RUN npm ci

CMD [ "node", "otel.js" ]
