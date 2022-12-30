# How to setup the local development

## Install npm dependencies

Run `npm run deep-install` from the root folder to install all dependencies from all subfolders.

## Setting up images folder

Create a `images` folder inside `src/backend`. This is needed for the images upload to work.

## Generating the Configuaration

Execute `npm run generate:config` from the root folder to setup all needed configuration files.

## Starting the local development landscape

1. Start the proxy by `cd mocks/proxy && npm start`
1. Go to `src/backend`
1. Build the backend by using `npm run build`
1. Start the backend by using `npm start`
1. Go to `src/frontend`
1. Start the frontend by using `npm run dev`
