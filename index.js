// server.js
const express = require('express');
const WebSocket = require('ws');
const http = require('http');

// Set up Express and HTTP server
const app = express();
const server = http.createServer(app);

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Store active WebSocket connections by username
let clients = {};

// Serve static files (index.html, chat.js, etc.)
app.use(express.static('public'));

// WebSocket server logic
wss.on('connection', (ws) => {
  let userName = null;
  console.log('A user connected');

  // When a message is received from a client
  ws.on('message', (message) => {
    console.log('Received:', message);

    // Parse the incoming message
    const data = JSON.parse(message);

    if (data.type === 'setUsername') {
      // Set the username of the client
      userName = data.username;
      clients[userName] = ws;
      ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the chat!' }));
      console.log(`${userName} joined the chat`);
    }

    if (data.type === 'privateMessage') {
      // Send private message to a specific user
      const targetUser = data.targetUser;
      if (clients[targetUser]) {
        clients[targetUser].send(JSON.stringify({
          type: 'privateMessage',
          from: userName,
          message: data.message,
        }));
        ws.send(JSON.stringify({
          type: 'privateMessage',
          from: 'You',
          message: data.message,
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'error',
          message: `User ${targetUser} not found.`,
        }));
      }
    }
  });

  // When the client disconnects
  ws.on('close', () => {
    if (userName) {
      delete clients[userName];
      console.log(`${userName} disconnected`);
    }
  });
});

// Start the HTTP and WebSocket server
server.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000');
});
