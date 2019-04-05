import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    nodes: [Node]!
    node(id: ID!): Node
  }

  type Mutation {
    updateNode(id: ID!, node: NodeInput!): Node
    clearNodes: Boolean
  }

  type Node {
    id: ID!
    type: NodeType!
    name: String
    pose: NodePose
    telemetry: NodeTelemetry
  }

  input NodeInput {
    type: NodeType
    name: String
    pose: NodePoseInput
    telemetry: NodeTelemetryInput
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

  input NodePoseInput {
    position: NodePositionInput
    orientation: NodeOrientationInput
  }

  type NodePosition {
    lat: Float!
    lon: Float!
  }

  input NodePositionInput {
    lat: Float!
    lon: Float!
  }

  type NodeOrientation {
    heading: Float!
    source: NodeOrientationSource
  }

  input NodeOrientationInput {
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

  input NodeTelemetryInput {
    groundSpeed: Float #
    # Other telemetry data goes here
  }
`;

export default typeDefs;
