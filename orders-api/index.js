const express = require('express');
const ampq = require('amqplib');

const app = express();

const amqpUrl = "amqp://localhost:5672";

const orderData = {
    customerId: 1,
    orderId: 7,
    number: "111 111 111"
}

app.use('/', async (req, res) => {
    try {
        res.send("Orders API");
        const connection = await ampq.connect(amqpUrl);
        console.log('Orders API connected to RabbitMQ server');
        const channel = await connection.createChannel();
        await channel.assertQueue("orders.shipped"); //if have channel name orders.shipped, then dont create. if dont then create a channel.
        //first is what queue we want to send data. second one is data which is send as a buffer
        await channel.sendToQueue("order.shipped", Buffer.from(JSON.stringify(orderData)));
    } catch (error) {
        console.log(error);
    }
});

app.listen(8081, () => {
    console.log("Order server is running at port 8081");
});