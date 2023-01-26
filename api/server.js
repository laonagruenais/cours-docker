const amqp = require("amqplib/callback_api");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const command = require("./models/command");
command.createTable();

const worker = require("../worker");
worker();

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/commands", async (req, res) => {
  try {
    const rows = await command.getCommands();
    res.json(rows);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get("/api/commands/:id", async (req, res) => {
  try {
    const row = await command.getCommand(req.params.id);
    res.json(row);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post("/api/commands", async (req, res) => {
  try {
    const commandId = await command.createCommand(req.body);
    amqp.connect("amqp://localhost:5672", (err, conn) => {
      conn.createChannel((err, ch) => {
        const q = "commandQueue";

        ch.assertQueue(q, { durable: true });
        ch.sendToQueue(q, Buffer.from(JSON.stringify({ commandId })));
      });
    });

    res.json({ commandId });
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
