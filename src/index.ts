import { ApolloServer, MockList } from "apollo-server";
import casual = require("casual");
import typeDefs from "./schema";

casual.define("position", () => ({
  // Lock coordinates around LLSC
  // 34.2181425, -83.9564373
  lat: casual.double(34.2131425, 34.2231425),
  lon: casual.double(-83.9514373, -83.9614373)
}));

const mocks = {
  Query: () => ({
    nodes: () =>
      new MockList([2, 6], () => ({
        name: casual.name,
        pose: () => ({
          position: (casual as any).position,
          orientation: () => ({
            heading: casual.double(0, 360)
          })
        }),
        telemetry: () => ({
          groundSpeed: casual.double(0, 20)
        })
      }))
  })
};

const server = new ApolloServer({ typeDefs, mocks });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
