const amqp = require('amqplib');

(async () => {
	const queue = process.argv[2] || 'test';
  const exchange = process.argv[3] || 'fanout-test';
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();

	await channel.assertQueue(queue);
  await channel.bindQueue(queue, exchange);

	await channel.consume(queue, message => {
		console.log(message.content.toString());
		channel.ack(message);
	});

  console.log('Consuming queue', queue);
  console.log('Queue binding to exchange', exchange);
})();
