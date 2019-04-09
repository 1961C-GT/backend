import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import * as http from "http";
import { merge } from "lodash";
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
        // Add new node structure
        datums.nodes[id] = {
          id: id,
          type: node.type,
          name: node.name,
          pose: (node.pose && {
            position: (node.pose.position && {
              lat: node.pose.position.lat || 0.0,
              lon: node.pose.position.lon || 0.0
            }) || {
              lat: 0.0,
              lon: 0.0
            },
            orientation: (node.pose.orientation && {
              heading: node.pose.orientation.heading || 0.0,
              source: node.pose.orientation.source || "UNKNOWN"
            }) || {
              heading: 0.0,
              source: "UNKNOWN"
            }
          }) || {
            position: {
              lat: 0.0,
              lon: 0.0
            },
            orientation: {
              heading: 0.0,
              source: "UNKNOWN"
            }
          },
          telemetry: {
            groundSpeed: 0.0,
            temp: 0.0,
            batt: 0.0
          }
        };
      }

      merge(datums.nodes[id], node);
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
const server = http.createServer(app);

server.listen(4000, () =>
  console.log(
    "🚀 Server ready at",
    `http://localhost:4000${apollo.graphqlPath}`
  )
);
