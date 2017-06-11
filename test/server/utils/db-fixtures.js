// Define our fixtures
exports.post = {
  model: 'post',
  attrs: {
    id: 'example-post-uuid',
    content: 'foobar'
  }
};
exports.comment = {
  model: 'comment',
  attrs: {
    id: 'example-comment-uuid',
    postId: 'example-post-uuid',
    content: 'baz'
  }
};
