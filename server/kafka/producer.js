const kafka = require('./');
const { encodePayload } = require('./registry');

const producer = kafka.producer();

const main = async () => {
  await producer.connect()
}

const sendToKafka = async (payload, eventName) => {
  try {
    const message = await encodePayload(eventName, payload)

    await producer.send({
      topic: 'accounts-stream',
      messages: [{ key: eventName, value: message }],
    })
  } catch (err) {
    console.log(err);
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})

module.exports = sendToKafka;
