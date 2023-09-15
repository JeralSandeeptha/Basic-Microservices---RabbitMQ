const express = require('express');
const ampq = require('amqplib');

const app = express();

const amqpUrl = "amqp://localhost:5672";

app.use('/', async (req, res) => {
    try {
        res.send("Notification API");
        connect();
    } catch (error) {
        
    }
});

async function connect() {
    try {
        const connection = await ampq.connect(amqpUrl);
        console.log('Orders API connected to RabbitMQ server');
        const channel = await connection.createChannel();
        await channel.assertQueue("orders.shipped");
        await channel.consume("orders.shipped", (message) => {
            console.log("Received Message from Queue");
            console.log(message.content.toString);
            channel.ack(message);
        }); 
    } catch (error) {
        console.log(error);
    }
}

app.listen(8082, () => {
    console.log("Notification server is running at port 8082");
});