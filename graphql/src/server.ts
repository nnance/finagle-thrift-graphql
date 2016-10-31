import * as hapi from "hapi";
import * as graphql from "graphql";
import { graphqlHapi, graphiqlHapi } from "graphql-server-hapi";

import ThriftClient from "./ThriftClient";
import * as Hello from "./gen-nodejs/Hello";
import * as Numbers from "./gen-nodejs/Numbers";

// Create a Calculator client with the connection
const helloClient = new ThriftClient("linkerd", 8081, Hello);
const numbersClient = new ThriftClient("linkerd", 8081, Numbers);

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    fields: {
      hello: {
        resolve: () => helloClient.client.hi(),
        type: graphql.GraphQLString,
      },
      randomNumber: {
        resolve: () => numbersClient.client.generate(),
        type: graphql.GraphQLInt,
      },
    },
    name: "Query",
  }),
});

// Create a server with a host and port
const server = new hapi.Server();
const graphqlPort = 3000;

server.connection({
  host: "0.0.0.0",
  port: graphqlPort,
});

server.register({
  options: {
    graphqlOptions: { schema },
    path: "/graphql",
  },
  register: graphqlHapi,
});

server.register({
  options: {
    graphiqlOptions: {
      endpointURL: "/graphql",
    },
    path: "/",
  },
  register: graphiqlHapi,
});

server.start(() => {
  console.log(`Server is listen on ${graphqlPort}`);
});
