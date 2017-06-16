// Load in our dependencies
const {expect} = require('chai');
const React = require('react');

const PostsApp = require('../../browser/js/posts-app');
const postsAppEmptyContract = require('../test-files/render-contracts/posts-app-empty.json');
const postsAppFullContract = require('../test-files/render-contracts/posts-app-full.json');
const reactUtils = require('./utils/react');

// Current strategy and notes
//   - We want a global store so we can easily manage state for multiple components
//   - Let's go with Redux as our single store
//   - It will likely sandwich in or preface this PR unless we find a `props` middleground for now
//   - On the fence maintenance wise, do we need preloaded state tests?
//       - Or anything that is redundant between browser/server for the same <PostsApp posts={posts}>?
//       - Do we need contracts for preloaded state?
//           - Current thought is basic redundancy between server/browser (empty/full) and edge cases in browser only
//   - For "fetch" functionality, let's definitely have Redux and add a `state` to posts
//       - This allows for a `state: pending` which can give us eager saving but UI cues for failure

// Updated strategy
//   - Relocate PostsApp to a `common` folder (including its tests)
//     and have common browser/server tests with explicit opt-in via `describe.server/describe.browser`
//   - Move to server test being that `window.__PRELOADED_STATE__` === `render` state
//     Then, make that state a contract for our common tests

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
