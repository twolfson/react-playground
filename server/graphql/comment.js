// Load in our dependencies
const {GraphQLID, GraphQLInputObjectType,
  GraphQLObjectType, GraphQLString} = require('graphql');

const {Post} = require('../models/post');

// Define our GraphQL type upfront
export const CommentObjectType = new GraphQLObjectType({
  name: 'CommentObjectType',
  description: 'A comment in its GraphQL representation',
  fields: {
    id: {
      description: 'ID of comment',
      type: GraphQLID
    },
    content: {
      description: 'Content of comment',
      type: GraphQLString
    }
  }
});

// Define our query container
export const queries = {
};

// Define our mutations container
// Mutations are based on
//   https://github.com/graphql/graphql-relay-js/blob/v0.5.2/src/mutation/mutation.js#L59-L112
const createCommentInputType = new GraphQLInputObjectType({
  name: 'createCommentInputType',
  description: 'Input arguments for `createComment`',
  fields: {
    postId: {
      description: 'ID of post to comment on',
      type: GraphQLID
    },
    content: {
      description: 'Content for comment being created',
      type: GraphQLString
    }
  }
});
export const mutations = {
  createComment: {
    type: CommentObjectType,
    description: 'Create a post',
    // DEV: We could use only GraphQL parameters but this feels more accurate/consistent
    //   https://medium.com/@HurricaneJames/graphql-mutations-fb3ad5ae73c4
    args: {
      input: {
        description: 'Input object for creating a post',
        type: createCommentInputType
      }
    },
    resolve(value, args, request) {
      // Retrieve our existing post, add a comment, and return it
      const post = Post.fetchByIdOr404(args.input.postId);
      const comment = post.addComment({content: args.input.content});
      comment.save();
      return comment;
    }
  }
};
