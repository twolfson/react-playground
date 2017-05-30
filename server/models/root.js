// Load in our dependencies
import {GraphQLObjectType, GraphQLString} from 'graphql';

// Define our root object type
export default new GraphQLObjectType({
  name: 'RootObjectType',
  fields: {
    // Sanity check endpoint for GraphQL syntax format
    status: {
      type: GraphQLString,
      resolve() {
        return 'OK';
      }
    }
  }
});
