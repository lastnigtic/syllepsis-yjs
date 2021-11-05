/**
 * @type {any}
 */
const WebSocket = require('ws');
const http = require('http');
const StaticServer = require('node-static').Server;

const setupWSConnection = require('y-websocket/bin/utils.js').setupWSConnection;

const port = 1234;
const staticServer = new StaticServer('../', { cache: 3600, gzip: true });

const server = http.createServer((request, response) => {
  request
    .addListener('end', () => {
      staticServer.serve(request, response);
    })
    .resume();
});
const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => setupWSConnection(conn, req));

server.listen(port);

console.log(`Listening to http://localhost:${port}`);
