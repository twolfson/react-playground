// Load in our dependencies
import {GraphQLID, GraphQLInputObjectType, GraphQLObjectType, GraphQLString} from 'graphql';
import uuidV4 from 'uuid/v4';

// Define our query container
export const queries = {
};

// Define our mutations container
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

export const mutations = {
  createPost: {
    type: PostObjectType,
    description: 'Create a post',
    // DEV: We could use only GraphQL parameters but this feels more accurate/consistent
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
};
