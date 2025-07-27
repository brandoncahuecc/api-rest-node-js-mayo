require("dotenv").config();
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const NOTIFICACION_QUEUE = process.env.NOTIFICACION_QUEUE;

async function iniciarReceptor() {
  try {
    const conexion = await amqp.connect(RABBITMQ_URL);
    const canal = await conexion.createChannel();
    await canal.assertQueue(NOTIFICACION_QUEUE, { durable: true });
    console.log(`Esperando mensajes en ${NOTIFICACION_QUEUE}`);

    canal.consume(
      NOTIFICACION_QUEUE,
      (msg) => {
        if (msg !== null) {
          const mensaje = JSON.parse(msg.content.toString());
          console.log("---------------------------------------");
          console.log("[X] Mensaje Recibido");
          console.log(mensaje);

          if (mensaje.type === "venta_creada") {
            console.log("Simulando envío de correo");
          }

          canal.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error(
      "Error al iniciar el consumidor/receptor de Rabbit MQ",
      error
    );
    process.exit(1);
  }
}

iniciarReceptor();
