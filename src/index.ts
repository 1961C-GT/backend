import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import * as fs from "fs";
import * as https from "https";
import typeDefs from "./schema";

let datums = {
  nodes: {}
};

const resolvers = {
  Query: {
    nodes() {
      return Object.values(datums.nodes);
    }
  },
  Mutation: {
    updateNode(parent, { id, node }) {
      if (!datums.nodes[id]) {
        datums.nodes[id] = node;
        datums.nodes[id].id = id;
        if (!node.type) {
          datums.nodes[id].type = "MOBILE";
        }
        return datums.nodes[id];
      }
      if (node.pose) {
        node.pose.position &&
          Object.assign(datums.nodes[id].pose.position, node.pose.position);
        node.pose.orientation &&
          Object.assign(
            datums.nodes[id].pose.orientation,
            node.pose.orientation
          );
      }
      if (node.telemetry) {
        Object.assign(datums.nodes[id].telemetry, node.telemetry);
      }
      return datums.nodes[id];
    },
    clearNodes() {
      datums.nodes = {};
    }
  }
};

const apollo = new ApolloServer({ typeDefs, resolvers });

const app = express();
apollo.applyMiddleware({ app });

// Create the HTTPS or HTTP server, per configuration
const server = https.createServer(
  {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/mnslac.xtriage.com/privkey.pem"
    ),
    cert: fs.readFileSync("/etc/letsencrypt/live/mnslac.xtriage.com/cert.pem")
  },
  app
);

server.listen(4000, () =>
  console.log(
    "🚀 Server ready at",
    `https://localhost:4000${apollo.graphqlPath}`
  )
);
