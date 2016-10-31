import * as thrift from "thrift";

const transport = thrift.TFramedTransport;
const protocol = thrift.TFramedProtocol;

enum ConnectionStates {
  Efforting,
  Connected,
  Timedout,
  Closed,
};

export default class ThriftClient {
  public client;
  private connection;
  private currentState;

  constructor(host: string, port: number, thriftIFace) {
    // Create Thrift client
    this.currentState = ConnectionStates.Efforting;

    this.connection = thrift.createConnection(host, port, {
      max_attempts: 10,
      protocol: protocol,
      transport: transport,
    });

    this.connection.on("error", (err) => {
      this.currentState = ConnectionStates.Efforting;
      console.error(err);
    });

    this.connection.on("timeout", (err) => this.currentState = ConnectionStates.Timedout);

    this.connection.on("connect", function(err) {
      if (this.currentState !== ConnectionStates.Connected) {
        this.currentState = ConnectionStates.Connected;
        console.error("connected");
      }
    });

    this.client = thrift.createClient(thriftIFace, this.connection);
  }
}
