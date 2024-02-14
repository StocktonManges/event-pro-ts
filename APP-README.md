These are the steps to start this application:

(1) Open three terminals.

(2) In terminal 1 run:
npx json-server --watch ./src/db.json

(3) In terminal 2 run:
cd src
npm run dev

(4) In terminal 3 run:
cd socket.io-server
npm run devStart

RESEED the database by opening a new terminal and running:
node reseed.js
