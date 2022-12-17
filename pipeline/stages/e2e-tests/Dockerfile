FROM node:18-slim

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /tests/shared

COPY integration-tests/shared /tests/shared
RUN npm ci

WORKDIR /tests/e2e-tests

COPY integration-tests/e2e-tests /tests/e2e-tests
RUN npm ci

ENV DATABASE_PATH=/database/recipes.db
ENV FRONTEND_BASE_URL=http://rezapp-proxy:8000

CMD [ "npm", "start" ]
