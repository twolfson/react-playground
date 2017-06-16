// Load in our dependencies
const {expect} = require('chai');
const React = require('react');

const PostsApp = require('../../browser/js/posts-app');
const postsAppEmptyContract = require('../test-files/render-contracts/posts-app-empty.json');
const postsAppFullContract = require('../test-files/render-contracts/posts-app-full.json');
const reactUtils = require('./utils/react');

// Updated strategy
//   - Relocate PostsApp to a `common` folder (including its tests)
//     and have common browser/server tests with explicit opt-in via `describe.server/describe.browser`

// Define our tests
describe('A PostApp component', function () {
  describe('with no content', function () {
    reactUtils.mount(function () {
      return (<PostsApp {...postsAppEmptyContract} />);
    });

    it('renders call to action for new post', function () {
      expect(this.$el.text()).to.contain('No posts exist yet. Create one via "Create Post"');
    });
  });

  describe('with multiple posts and comments', function () {
    reactUtils.mount(function () {
      return (<PostsApp {...postsAppFullContract} />);
    });

    it('renders posts and comments', function () {
      expect(this.$el.text()).to.contain('This is an example post');
      expect(this.$el.text()).to.contain('This is an example comment');
      expect(this.$el.text()).to.contain('This is another example comment');
      expect(this.$el.text()).to.contain('This is another example post');
    });
  });
});
