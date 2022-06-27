# Micro-serviço com Node.js

- Utilizando Kafka;
- Utilizando Node;

## Aplicações

- API principal - Chama o serviço de certificação;
- Certificadora - Emite o certificado;

## Fluxo

- API principal envia uma mensagem pro serviço de certificação para gerar o certificado;
- Micro-serviço de certificação devolve uma resposta (síncrona/assíncrona);

## API DE CERTIFICAÇÃO

- Chama a rota Post que envia uma mensagem para o tópico "issue-certificate";
- Escuta a mensagem de resposta do tópico "certification-response";
- A resposta informa que o certificado foi gerado;

## MICRO-SERVIÇO DE CERTIFICAÇÃO

- Escuta a mensagem do tópico "issue-certificate";
- A mensagem contém um "user_name" e um "course";
- Envia uma mensagem para o tópico "certification-response";;
- A resposta informa que o certificado foi gerado;

## FONTE

Code Challenge: Micro-serviços com Node e Kafka - RocketSeat

https://www.youtube.com/watch?v=-H8pD7sMcfo
