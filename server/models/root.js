// Load in our dependencies
import uuidV4 from 'uuid/v4';
import httpErrors from 'http-errors';
import {GraphQLID, GraphQLInputObjectType, GraphQLObjectType, GraphQLString} from 'graphql';

// Define our root object type
export const RootQueryObjectType = new GraphQLObjectType({
  name: 'RootQueryObjectType',
  description: 'Root for all queries',
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
let posts = [];
let postsById = {};
const createPostInputType = new GraphQLInputObjectType({
  name: 'createPostInputType',
  fields: {
    content: {type: GraphQLString}
  }
});
const PostObjectType = new GraphQLObjectType({
  name: 'PostObjectType',
  fields: {
    id: {type: GraphQLID},
    content: {type: GraphQLString}
  }
});

export const RootMutationObjectType = new GraphQLObjectType({
  name: 'RootMutationObjectType',
  description: 'Root for all mutations',
  fields: {
    createPost: {
      type: PostObjectType,
      args: {
        input: {type: createPostInputType}
      },
      resolve(value, args, request) {
        // Create, save, and return our post
        const post = {id: uuidV4(), content: args.input.content};
        posts.push(post);
        postsById[post.id] = post;
        return post;
      }
    }
  }
});
