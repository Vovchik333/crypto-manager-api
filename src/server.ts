import Fastify from 'fastify';

const fastify = Fastify();

fastify.get('/', (request, reply) => {
    reply.send({ message: 'hello world' });
});

const start = async () => {
    try {
      await fastify.listen({ port: 8080 })
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
}

start();