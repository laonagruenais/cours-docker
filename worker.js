const amqp = require("amqplib/callback_api");
const commandModel = require("./api/models/command");

const worker = () =>
  amqp.connect("amqp://localhost", (err, conn) => {
    conn.createChannel((err, ch) => {
      const q = "commandQueue";

      ch.assertQueue(q, { durable: true });
      ch.consume(q, async (msg) => {
        const command = JSON.parse(msg.content.toString());
        command.status = "ok";
        try {
          await commandModel.updateCommand(command);
          ch.ack(msg);
        } catch (err) {
          console.log(err);
          ch.nack(msg);
        }
      });
    });
  });

module.exports = worker;
