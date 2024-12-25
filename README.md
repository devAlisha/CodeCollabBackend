# Code Collab Backend

This is the backend for the Code Collab application, which provides real-time collaborative coding features using Node.js, Express, and Socket.io.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/CodeCollabBackendNew.git
    cd CodeCollabBackendNew
    ```

2. Install dependencies:
    ```sh
    yarn install
    ```

## Usage

To start the server in development mode with hot-reloading:
```sh
yarn dev
```

To start the server in production mode:
```sh
yarn start
```

## Environment Variables

Create a .env file in the root directory and add the following environment variables:

```
PORT=5000
ORIGIN=http://localhost:3000
```

## Project Structure

```plaintext
src
├── config
│   └── envVariables.js
├── server.js
└── socket
    └── roomSocket
        ├── createRoomHandler.js
        ├── disconnectHandler.js
        ├── joinRoomHandler.js
        ├── leaveRoomHandler.js
        ├── roomHandler.js
        └── updateHandler.js
    utils
        └── cleanupDisconnectHandler.js
index.js
package.json
README.md
.gitignore
.editorconfig
.yarnrc.yml
```

## Dependencies

- [express](https://www.npmjs.com/package/express)
- [socket.io](https://www.npmjs.com/package/socket.io)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [nodemon](https://www.npmjs.com/package/nodemon)
