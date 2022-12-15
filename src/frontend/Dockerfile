FROM node:18-alpine as build

WORKDIR /build

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM denoland/deno:alpine

WORKDIR /app

COPY --from=build /build/build .

CMD [ "deno", "run", "--allow-env", "--allow-read", "--allow-net", "index.js" ]
