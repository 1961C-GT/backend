import * as express from 'express';
import { ApolloServer, MockList } from 'apollo-server-express';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
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

const apollo = new ApolloServer({ typeDefs, mocks });

const app = express();
apollo.applyMiddleware({ app });

// Create the HTTPS or HTTP server, per configuration
const server = https.createServer(
  {
    key: fs.readFileSync('/etc/letsencrypt/live/mnslac.xtriage.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/mnslac.xtriage.com/cert.pem')
  },
  app
);

server.listen(4000, () =>
  console.log(
    '🚀 Server ready at',
    `https://localhost:4000${apollo.graphqlPath}`
  )
);
