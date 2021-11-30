const amqp = require('amqplib');

(async () => {
	const queue = 'test';
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();
	await channel.assertQueue(queue);
	await channel.consume(queue, message => {
		console.log(message.content.toString());	
		channel.ack(message);
	});
})();
