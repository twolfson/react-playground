// Load in our dependencies
const {GraphQLSchema} = require('graphql');

const {RootQueryObjectType, RootMutationObjectType} = require('./root');

// Initialize our schema and export it
exports.schema = new GraphQLSchema({
  query: RootQueryObjectType,
  mutation: RootMutationObjectType
});
