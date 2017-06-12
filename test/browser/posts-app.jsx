// Load in our dependencies
const {expect} = require('chai');
const React = require('react');

const PostsApp = require('../../browser/js/posts-app');
const reactUtils = require('./utils/react');
const sinonUtils = require('../utils/sinon');

// Define our tests
describe('A PostApp component', function () {
  describe('with no content', function () {
    sinonUtils.mockXHR([{
      method: 'POST',
      url: '/graphql',
      fn: function handleGraphQL () {
        console.log('wat', arguments);
      }
    }]);
    reactUtils.mount(function () {
      return (<PostsApp />);
    }, {waitForRequests: 1});

    it('renders call to action for new post', function () {
      expect(this.$el.text()).to.contain('No posts exist yet. Create one via "Create Post"');
    });
  });
});
