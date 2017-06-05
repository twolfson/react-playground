// Load in our dependencies
import uuidV4 from 'uuid/v4';
import httpErrors from 'http-errors';
import {GraphQLID, GraphQLInputObjectType, GraphQLObjectType, GraphQLString} from 'graphql';

// Define our root object type
export const RootQueryObjectType = new GraphQLObjectType({
  name: 'RootQueryObjectType',
  description: 'Root for all queries',
  fields: {
    status: {
      type: GraphQLString,
      description: 'Sanity field for verifying a query works',
      resolve(parentValue, args, req) {
        return 'OK';
      }
    },
    echo: {
      type: GraphQLString,
      description: 'Echo input argument as output value',
      args: {
        content: {
          description: 'Value to output',
          type: GraphQLString
        }
      },
      resolve(parentValue, args, req) {
        return args.content;
      }
    },
    whoami: {
      type: GraphQLString,
      description: 'Email address of logged in user. If not logged in, this will 403',
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
  description: 'Input arguments for `createPost`',
  fields: {
    content: {
      description: 'Content for post being created',
      type: GraphQLString
    }
  }
});
const PostObjectType = new GraphQLObjectType({
  name: 'PostObjectType',
  description: 'A post in its GraphQL representation',
  fields: {
    id: {
      description: 'ID of post',
      type: GraphQLID
    },
    content: {
      description: 'Content of post',
      type: GraphQLString
    }
  }
});

export const RootMutationObjectType = new GraphQLObjectType({
  name: 'RootMutationObjectType',
  description: 'Root for all mutations',
  fields: {
    createPost: {
      type: PostObjectType,
      description: 'Create a post',
      // DEV: According to an article, we could use only GraphQL parameters but this feels more accurate/consistent
      //   https://medium.com/@HurricaneJames/graphql-mutations-fb3ad5ae73c4
      args: {
        input: {
          description: 'Input object for creating a post',
          type: createPostInputType
        }
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
