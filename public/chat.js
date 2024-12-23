let socket;
let username;

// Function to set the username and connect to the WebSocket server
function setUsername() {
  username = document.getElementById('username').value;
  if (username) {
    socket = new WebSocket('ws://localhost:3000');  // Connect to the WebSocket server

    socket.onopen = function () {
      console.log('Connected to WebSocket server');
      socket.send(JSON.stringify({ type: 'setUsername', username: username }));

      document.getElementById('login').style.display = 'none';
      document.getElementById('chat').style.display = 'block';
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);

      if (data.type === 'welcome') {
        console.log(data.message);
      } else if (data.type === 'privateMessage') {
        displayMessage(data.from, data.message);
      } else if (data.type === 'error') {
        alert(data.message);
      }
    };
  } else {
    alert('Please enter a valid username');
  }
}

// Function to send private message
function sendPrivateMessage() {
  const targetUser = document.getElementById('targetUser').value;
  const message = document.getElementById('messageInput').value;

  if (targetUser && message) {
    socket.send(JSON.stringify({
      type: 'privateMessage',
      targetUser: targetUser,
      message: message,
    }));
  }
}

// Function to display messages in the chat window
function displayMessage(from, message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = `${from}: ${message}`;
  document.getElementById('messages').appendChild(messageElement);
}
