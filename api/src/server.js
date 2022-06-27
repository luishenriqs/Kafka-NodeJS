/****************** API DE CERTIFICAÇÃO ******************/
/*** Chama a rota Post que envia uma mensagem para o tópico "issue-certificate" ***/
/*** Escuta a mensagem de resposta do tópico "certification-response" ***/
/*** A resposta informa que o certificado foi gerado ***/

import express from "express";
import { Kafka, logLevel } from "kafkajs";
import { routes } from "./routes";

const app = express();

/*** CONEXÃO COM O KAFKA ***/
const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:9092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

/*** CRIA UM PRODUCER ***/
const producer = kafka.producer();

/*** CRIA UM CONSUMER ***/
const consumer = kafka.consumer({ groupId: "certificate-group-receiver" });
const topic = "issue-certificate";

/*** MIDLEWARE - DISPONIBILIZA O PRODUCER PARA TODAS AS ROTAS ***/
app.use((req, res, next) => {
  req.producer = producer;
  return next();
});

/*** CADASTRA AS ROTAS DA APLICAÇÃO ***/
/*** ROTA POST -> PRODUCER DISPARA MENSAGEM PARA O TÓPICO "issue-certificate" ***/
app.use(routes);

/*** CONECTA O PRODUCER, O CONSUMER, E RODA O SERVIDOR ***/
async function run() {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: "certification-response" });
  await consumer.run({
    /*** CONSUMER - ESCUTA A MENSAGEM DO TÓPICO "certification-response"  ***/
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Resposta:", String(message.value));
    },
  });

  app.listen(3333);
}

run().catch(console.error);
