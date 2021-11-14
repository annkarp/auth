const { SchemaRegistry, SchemaType } = require('@kafkajs/confluent-schema-registry');
const { v4: uuidv4 } = require("uuid");

const registry = new SchemaRegistry({ host: 'http://localhost:8081' })

const getRegistryId = async (subject, version) => {
  return await registry.getRegistryId(subject, version)
}

const encodePayload = async (subject, data) => {
  const id = await getRegistryId(subject, 1)

  try {
    const payload = {
      event_id: uuidv4(),
      event_version: 1,
      event_time: Date.now(),
      producer: 'auth_service',
      event_name: subject,
      data,
    }

    return await registry.encode(id, payload)
  } catch (err) {
    console.log(err)
  }
};

const decodePayload = async (payload) => {
  const data = await registry.decode(payload)
  return data
};

const addSchema = async (schema, subject) => {
  return await registry.register(
  { type: SchemaType.JSON, schema },
  { subject })
};

module.exports = {
  encodePayload,
  decodePayload,
  addSchema,
};
