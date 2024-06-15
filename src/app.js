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
const prometheusApiMetrics = require('prometheus-api-metrics');

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

// Middleware để đếm số lượng requests
app.use((req, res, next) => {
  counter.inc();
  next();
});

// Endpoint để lấy metrics dưới dạng JSON
app.get('/metrics-json', async (req, res) => {
  try {
    const metrics = await client.register.getMetricsAsJSON();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
scheduler.scheduleEmail();


server.listen(port, () => {
    console.log(`server running on port: http://localhost:${port}`);
});
