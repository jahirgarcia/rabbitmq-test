const amqp = require('amqplib');

async function sleep(ms) {
	return new Promise(res => setTimeout(() => res(), ms));
}

async function sleepLoop(ms, fn) {
	while(true) {
		fn();
		await sleep(ms);
	}
}

(async () => {
  const exchange = process.argv[2] || 'fanout-test';
  const routingKey = 'fanout-test-routing-key';
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'fanout');

	await sleepLoop(500, async () => {
		const message = `Mensaje de prueba no.: ${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
    await channel.publish(exchange, routingKey, Buffer.from(message));
		console.log('Message:', JSON.stringify(message), 'send to exchange:', exchange);
	});
})();
