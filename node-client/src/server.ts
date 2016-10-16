import * as hapi from 'hapi';
import * as graphql from 'graphql';
import { apolloHapi, graphiqlHapi } from 'apollo-server';

const thrift = require('thrift');
const Hello = require('./gen-nodejs/Hello');

// Create Thrift client
const transport = thrift.TFramedTransport;
const protocol = thrift.TFramedProtocol;

const connection = thrift.createConnection('localhost', 8081, {
  transport : transport,
  protocol : protocol,
});

connection.on('error', function(err) {
  console.error(err);
});

// Create a Calculator client with the connection
const client = thrift.createClient(Hello, connection);

const schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            testString: {
                type: graphql.GraphQLString,
                resolve: client.hi.bind(client),
            },
        },
    }),
});

// Create a server with a host and port
const server = new hapi.Server();
const graphqlPort = 3000;

server.connection({
    host: 'localhost',
    port: graphqlPort,
});

server.register({
  register: apolloHapi,
  options: {
    path: '/graphql',
    apolloOptions: () => ({
      schema: schema,
    }),
  },
});

server.register({
  register: graphiqlHapi,
  options: {
    path: '/graphql',
    graphiqlOptions: {
      endpointURL: '/graphql',
    },
  },
});

server.start(() => {
  console.log(`Server is listen on ${graphqlPort}`);
});
