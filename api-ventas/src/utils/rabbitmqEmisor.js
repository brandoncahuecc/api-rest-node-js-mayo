require("dotenv").config();
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const NOTIFICACION_QUEUE = process.env.NOTIFICACION_QUEUE;

let canal = null;

async function conectarRabbitMQ() {
  if (canal) return canal;

  try {
    const conexion = await amqp.connect(RABBITMQ_URL);
    canal = await conexion.createChannel();
    await canal.assertQueue(NOTIFICACION_QUEUE, { durable: true });
    console.log(`Conexión a Rabbit MQ y cola ${NOTIFICACION_QUEUE}`);
    return canal;
  } catch (error) {
    console.error("Error al conectarme a Rabbit MQ", error);
    canal = null;
  }
}

async function publicarMensaje(mensaje) {
  try {
    const ch = await conectarRabbitMQ();
    ch.sendToQueue(NOTIFICACION_QUEUE, Buffer.from(JSON.stringify(mensaje)), {
      persistent: true,
    });
    console.log(`Mensaje enviado a la cola ${NOTIFICACION_QUEUE}`);
  } catch (error) {
    console.error("Error al publicar el mensaje a Rabbit MQ", error);
  }
}

module.exports = { publicarMensaje };
