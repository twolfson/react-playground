// Load in our dependencies
import {GraphQLObjectType, GraphQLString} from 'graphql';

// Define our root object type
export default new GraphQLObjectType({
  name: 'RootObjectType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        return 'world';
      }
    }
  }
});
