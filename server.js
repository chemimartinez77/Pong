const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const server = new WebSocket.Server({ port: PORT });

let players = [];

server.on('connection', (socket) => {
    console.log('New player connected');
    players.push(socket);

    if (players.length === 2) {
        players.forEach((player, index) => {
            player.send(JSON.stringify({ player: index + 1 }));
        });
    }

    socket.on('message', (message) => {
        console.log('Message received:', message);
        players.forEach((player) => {
            if (player !== socket) {
                player.send(message);
            }
        });
    });

    socket.on('close', () => {
        console.log('Player disconnected');
        players = players.filter((player) => player !== socket);
    });
});

console.log(`WebSocket server running on port ${PORT}`);
