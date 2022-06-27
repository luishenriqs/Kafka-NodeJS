/****************** SERVIÇO DE CERTIFICAÇÃO ******************/
/*** Escuta a mensagem do tópico "issue-certificate" ***/
/*** A mensagem contém um "user_name" e um "course" ***/
/*** Envia uma mensagem para o tópico "certification-response" ***/
/*** A resposta informa que o certificado foi gerado ***/

import { Kafka, logLevel } from "kafkajs";

/*** CONEXÃO COM O KAFKA ***/
const kafka = new Kafka({
  clientId: "certificate",
  brokers: ["localhost:9092"],
  //logLevel: logLevel.NOTHING,
});

/*** CRIA UM CONSUMER ***/
const consumer = kafka.consumer({ groupId: "certificate-group" });
const topic = "issue-certificate";

/*** CRIA UM PRODUCER ***/
const producer = kafka.producer();

/*** CONECTA O CONSUMER E O PRODUCER ***/
async function run() {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    /*** CONSUMER - ESCUTA A MENSAGEM DO TÓPICO "issue-certificate"  ***/
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic} - [${partition} | ${message.offset}]`;
      console.log(`- ${prefix} ${message.value}`);

      const payload = JSON.parse(message.value);

      /*** PRODUCER - DISPARA MENSAGEM DE RESPOSTA PARA O TÓPICO "certification-response" ***/
      setTimeout(() => {
        producer.send({
          topic: "certification-response",
          messages: [
            {
              value: `- Certificado do usuário ${payload.user_name} do curso ${payload.course} gerado!`,
            },
          ],
        });
      }, 3000);
    },
  });
}

run().catch(console.error);
