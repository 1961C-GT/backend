import { ApolloServer, MockList } from "apollo-server";
import * as casual from "casual";
import typeDefs from "./schema";

casual.define("position", () => ({
  // Lock coordinates around Chattahoochee Bay
  // 34.2112456, -83.9658699
  lat: casual.double(34.2112456, 34.2212456),
  lon: casual.double(-83.9508699, -83.9608699)
}));

const mocks = {
  Query: () => ({
    nodes: () =>
      new MockList([4, 16], () => ({
        name: () => `Node ${casual.letter.toLocaleUpperCase()}`,
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
