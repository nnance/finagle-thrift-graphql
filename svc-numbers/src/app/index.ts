import * as thrift from "thrift";
import * as Numbers from "./gen-nodejs/Numbers";

const port = process.env.PORT || 9091;

const randomizer = (bottom, top) => {
  return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
};

const server = thrift.createServer(Numbers, {
  generate: (result) => {
    result(null, randomizer(1, 10));
  },
}, {
  protocol: thrift.TFramedProtocol,
  transport: thrift.TFramedTransport,
});

server.listen(port);
