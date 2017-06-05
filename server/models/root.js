// Load in our dependencies
import httpErrors from 'http-errors';
import {GraphQLObjectType, GraphQLString} from 'graphql';

// Define our root object type
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

// Define our root mutation object type
// Mutations are based on
//   https://github.com/graphql/graphql-relay-js/blob/v0.5.2/src/mutation/mutation.js#L59-L112
// TODO: What's the difference between `InputObjectType` and `ObjectType`?
const createPostInputType = new GraphQLInputObjectType({
  name: 'createPostInputType',
  fields: {
    content: {type: GraphQLString}
  }
});
const createPostOutputType = new GraphQLObjectType({
  name: 'createPostOutputType',
  fields: {
    content: {type: GraphQLString}
  }
});

export const RootMutationObjectType = new GraphQLObjectType({
  name: 'RootMutationObjectType',
  fields: {
    createPost: {
      type: createPostOutputType,
      args: {
        input: {type: createPostInputType}
      },
      resolve(value, args, request) {
        return new createPostOutputType(args.content);
      }
    }
  }
});
