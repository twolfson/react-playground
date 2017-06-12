// Load in our dependencies
const {expect} = require('chai');
const React = require('react');

const PostsApp = require('../../browser/js/posts-app');
const reactUtils = require('./utils/react');
const sinonUtils = require('../utils/sinon');

// Define our tests
describe('A PostApp component', function () {
  describe('loading content', function () {
    sinonUtils.mockXHR([{graphql: 'loading-only'}]);
    reactUtils.mount(function () {
      return (<PostsApp />);
    });

    it('renders loading prompt', function () {
      expect(this.$el.text()).to.contain('Loading...');
    });
  });

  describe('with no content', function () {
    sinonUtils.mockXHR([
      {graphql: 'posts-and-comments-empty-200.json'}
    ]);
    reactUtils.mount(function () {
      return (<PostsApp />);
    });

    it('renders call to action for new post', function () {
      this.sinonServer.respond();
      expect(this.$el.text()).to.contain('No posts exist yet. Create one via "Create Post"');
    });
  });

  describe('with multiple posts and comments', function () {
    sinonUtils.mockXHR([
      {graphql: 'posts-and-comments-full-200.json'}
    ]);
    reactUtils.mount(function () {
      return (<PostsApp />);
    });

    it('renders posts and comments', function () {
      this.sinonServer.respond();
      expect(this.$el.text()).to.contain('This is an example post');
      expect(this.$el.text()).to.contain('This is an example comment');
      expect(this.$el.text()).to.contain('This is another example comment');
      expect(this.$el.text()).to.contain('This is another example post');
    });
  });
});
