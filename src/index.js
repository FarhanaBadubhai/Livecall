
const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const roomRoutes = require('./routes/room.routes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


// Routes
app.use('/api/rooms', roomRoutes);

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} - ${req.path}`);
    next();
  });
  

// WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Track connected clients
const clients = new Map();

wss.on('connection', (ws) => {
  const clientId = Date.now();
  clients.set(ws, clientId);

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    
    switch(data.type) {
      case 'JOIN_ROOM':
        // Update participant count in database
        await pool.query(
          'UPDATE rooms SET participants = participants + 1 WHERE room_id = $1',
          [data.roomId]
        );
        break;
        
      case 'LEAVE_ROOM':
        await pool.query(
          'UPDATE rooms SET participants = participants - 1 WHERE room_id = $1',
          [data.roomId]
        );
        break;
    }

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Add this line after other middleware
app.use(express.static('public'));

const authRoutes = require('./routes/auth.routes');

// Add this line with other routes
app.use('/api/auth', authRoutes);
