# PlaceOS React Starter

![BUILD](https://github.com/placeos/react-starter/workflows/BUILD/badge.svg)

React starter repository for PlaceOS applications.
This repository provides a starting point for building PlaceOS applications using React.

It contains the following:
- Authentication setup by initialising [@placeos/ts-client](https://github.com/placeos/ts-client)
- A simple bootstrap page for setting up the application with a system
- A simple page showing how to use the PlaceOS Realtime API to monitor and control a system

## Setup

1. Install [NodeJS](https://nodejs.org/en/download/current/)
1. Run `npm install` in the root folder

## Development

To run the dev server use the command `npm run dev`.
After running the dev server, open your browser and navigate to `http://localhost:5173`.

### Connecting to a live environment

If you wish to develop with a live environment you can change the details in [`vite.config.js`](./vite.config.js)
to point the the server with the live environment and update the SSL settings the match that environment.

Note that OAuth redirects don't work when connecting you local instance to the live environment.
To login in the local instance you will either need to copy a token from a live instance or use the basic auth form at `/login/?continue=/`.
For the local login you will need to create a user or set a password for an auto-generated user.

## Compilation

Compile the application into static files using `npm run build`.
The static files will be placed in the `dist` folder.

## Deployment

Github actions have been setup for creating build artifacts and deploying them to a standalone branches on this repository.

Each application has a seperate branch dedicated to each of it's build types.

Commits to the branch `trunk` will produce development builds that are committed to the branches `build/dev`
Commits to the branch `release/**` will produce development builds that are committed to the branches `build/prod`.
You should have only one `release` branch at a time and it should be kept inline with develop rather than worked on directly.
Commits to the branch `feat/**` will produce a production build that is commited to the branch `build/<branch-name>`
