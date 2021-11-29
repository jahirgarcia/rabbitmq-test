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
	const queue = 'test';
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();
	await channel.assertQueue(queue);

	await sleepLoop(500, async () => {
		const message = `Mensaje de prueba no.: ${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
		await channel.sendToQueue(queue, Buffer.from(message));
		console.log('Message:', JSON.stringify(message), 'send to queue:', queue);
	});
})();
