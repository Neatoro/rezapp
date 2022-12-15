FROM node:18-alpine as build

WORKDIR /build

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /build/package*.json .
RUN npm ci --omit=dev

COPY --from=build /build/dist /app/dist
CMD [ "node", "." ]
