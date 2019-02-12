import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    nodes: [Node]!
    node(id: ID!): Node
  }

  type Node {
    id: ID!
    type: NodeType!
    name: String
    pose: NodePose
    telemetry: NodeTelemetry
  }

  enum NodeType {
    BASE
    FIXED
    MOBILE
  }

  type NodePose {
    position: NodePosition
    orientation: NodeOrientation
  }

  type NodePosition {
    lat: Float!
    lon: Float!
  }

  type NodeOrientation {
    heading: Float!
    source: NodeOrientationSource
  }

  enum NodeOrientationSource {
    POSITION
    TELEMETRY
  }

  type NodeTelemetry {
    groundSpeed: Float #
    # Other telemetry data goes here
  }
`;

export default typeDefs;
