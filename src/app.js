const express = require("express");
const app = express();
const route = require("./routes");
const socketIo = require('socket.io');
const http = require('http');
require("dotenv").config();
const port = process.env.PORT || 5000;
const scheduler = require('./utils/scheduler');
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const counter = new client.Counter({
  name: 'node_request_operations_total',
  help: 'The total number of processed requests'
});

const cors = require("cors");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: true,
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.post('/create-room', async (req, res) => {
  try {
    const response = await axios.post('https://api.daily.co/v1/rooms', {
      properties: {
        exp: 0, // Thời gian sống của phòng
        is_private: false, // Phòng không riêng tư
        enable_chat: true, // Cho phép chat trong phòng
      },
      name: req.body.roomID // Tên phòng sẽ là RoomID
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DAILY_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(
    cors({
        // origin: (process.env.CLIENT_URL || "").split(","),
    })
); // Use this after the variable declaration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
route(app);

app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

scheduler.scheduleUpdate();


server.listen(port, () => {
    console.log(`server running on port: http://localhost:${port}`);
});
