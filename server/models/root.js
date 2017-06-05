// Load in our dependencies
import httpErrors from 'http-errors';
import {GraphQLObjectType, GraphQLString} from 'graphql';

// Define our root object type
export default new GraphQLObjectType({
  name: 'RootObjectType',
  fields: {
    // Sanity check endpoint for GraphQL syntax format
    status: {
      type: GraphQLString,
      resolve(parentValue, args, req) {
        return 'OK';
      }
    },
    // Echo endpoint
    echo: {
      type: GraphQLString,
      args: {
        content: {type: GraphQLString}
      },
      resolve(parentValue, args, req) {
        return args.content;
      }
    },
    // Authentication and authorization check endpoint
    whoami: {
      type: GraphQLString,
      resolve(parentValue, args, req) {
        // If the user is logged out, then reject them
        // TODO: Create a helper resolver
        if (!req.session.email) {
          throw new httpErrors.Forbidden();
        }

        // Otherwise, reply with their email
        return req.session.email;
      }
    }
  }
});
