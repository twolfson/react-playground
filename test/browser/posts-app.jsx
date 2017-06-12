// Load in our dependencies
const {expect} = require('chai');
const React = require('react');

const PostsApp = require('../../browser/js/posts-app');
const reactUtils = require('./utils/react');
const sinonUtils = require('../utils/sinon');

// Define our tests
describe('A PostApp component', function () {
  describe('loading content', function () {
    sinonUtils.mockXHR([{
      method: 'POST',
      url: '/graphql',
      fn: function handleGraphQL (req) {
        throw new Error('Should not be called due to loading only tests');
      }
    }]);
    reactUtils.mount(function () {
      return (<PostsApp />);
    });

    it('renders loading prompt', function () {
      expect(this.$el.text()).to.contain('Loading...');
    });
  });

  describe('with no content', function () {
    sinonUtils.mockXHR([{
      method: 'POST',
      url: '/graphql',
      fn: function handleGraphQL (req) {
        // http://sinonjs.org/releases/v2.3.4/fake-xhr-and-server/#simulating-server-responses
        req.respond(200, {}, JSON.stringify({
          data: {
            posts: []
          }
        }));
      }
    }]);
    reactUtils.mount(function () {
      return (<PostsApp />);
    });

    it('renders call to action for new post', function () {
      this.sinonServer.respond();
      expect(this.$el.text()).to.contain('No posts exist yet. Create one via "Create Post"');
    });
  });
});
