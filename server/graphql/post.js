// Load in our dependencies
const {GraphQLID, GraphQLInputObjectType, GraphQLList,
  GraphQLObjectType, GraphQLString} = require('graphql');

const Comment = require('../models/comment');
const Post = require('../models/post');
const {CommentObjectType} = require('./comment');

// Define our GraphQL type upfront
exports.PostObjectType = new GraphQLObjectType({
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
    },
    comments: {
      description: 'Comments on a post',
      type: new GraphQLList(CommentObjectType),
      resolve(post, args, request) {
        return Comment.getAll({postId: post.id});
      }
    }
  }
});

// Define our query container
exports.queries = {
  posts: {
    description: 'Retrieve posts',
    type: new GraphQLList(exports.PostObjectType),
    resolve(parentValue, args, req) {
      return Post.getAll();
    }
  }
};

// Define our mutations container
// Mutations are based on
//   https://github.com/graphql/graphql-relay-js/blob/v0.5.2/src/mutation/mutation.js#L59-L112
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
exports.mutations = {
  createPost: {
    type: exports.PostObjectType,
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
      const post = new Post({content: args.input.content});
      post.save();
      return post;
    }
  }
};
