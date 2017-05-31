// Load in our dependencies
import httpErrors from 'http-errors';
import {GraphQLObjectType, GraphQLString} from 'graphql';

// Define our root object type and mutation object type
// TODO: Add description to object type and fields
export const RootQueryObjectType = new GraphQLObjectType({
  name: 'RootQueryObjectType',
  fields: {
    // Sanity check endpoint for GraphQL syntax format
    status: {
      type: GraphQLString,
      resolve(parentValue, args, req) {
        return 'OK';
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

class PostQueryObjectType {
  constructor(content) {
    this.content = content;
  }
}

export const RootMutationObjectType = new GraphQLObjectType({
  name: 'RootMutationObjectType',
  fields: {
    createPost: {
      type: PostQueryObjectType,
      args: {
        content: {type: GraphQLString}
      },
      resolve(value, args, request) {
        return new PostQueryObjectType(args.content);
      }
    }
  }
});
