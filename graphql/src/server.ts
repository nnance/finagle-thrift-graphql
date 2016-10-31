import * as hapi from "hapi";
import * as graphql from "graphql";
import { graphqlHapi, graphiqlHapi } from "graphql-server-hapi";

// tslint:disable
const thrift = require("thrift");
const Hello = require("./gen-nodejs/Hello");
// tslint:enable

// Create Thrift client
const transport = thrift.TFramedTransport;
const protocol = thrift.TFramedProtocol;

enum ConnectionStates {
  Efforting,
  Connected,
  Timedout,
  Closed,
}

let currentState = ConnectionStates.Efforting;

const connection = thrift.createConnection("linkerd", 8081, {
  max_attempts: 10,
  protocol: protocol,
  transport: transport,
});

connection.on("error", (err) => {
  currentState = ConnectionStates.Efforting;
  console.error(err);
});

connection.on("timeout", (err) => currentState = ConnectionStates.Timedout);

connection.on("connect", function(err) {
  if (currentState !== ConnectionStates.Connected) {
    currentState = ConnectionStates.Connected;
    console.error("connected");
  }
});

// Create a Calculator client with the connection
const client = thrift.createClient(Hello, connection);

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    fields: {
      testString: {
        resolve: client.hi.bind(client),
        type: graphql.GraphQLString,
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
