// Define our fixtures
export const post = {
  model: 'post',
  attrs: {
    id: 'example-post-uuid',
    content: 'foobar'
  }
};
export const comment = {
  model: 'comment',
  attrs: {
    id: 'example-comment-uuid',
    postId: 'example-post-uuid',
    content: 'baz'
  }
};
