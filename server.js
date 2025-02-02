const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;

// Servidor HTTP para servir el HTML
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Servidor WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
    console.log('New player connected');

    socket.on('message', (message) => {
        console.log('Message received:', message);
        // Reenviar mensaje a todos los clientes conectados
        wss.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on('close', () => {
        console.log('Player disconnected');
    });
});

// Inicia el servidor HTTP y WebSocket
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
