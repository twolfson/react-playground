// Load in dependencies
const assert = require('assert');

const {expect} = require('chai');

const dbFixtures = require('./utils/db-fixtures');
const httpUtils = require('./utils/http');
const serverUtils = require('./utils/server');
const testUtils = require('./utils/test');
const PostsApp = require('../../browser/js/posts-app');

// Define our test helper
const renderUtils = {
  swapProps: function (Component) {
    before(function swapPropsFn () {
      // Define our location to save props
      assert.strictEqual(this.propsSetCount, undefined,
        'Expected `renderUtils.swapProps` to not be called multiple times but it was');
      this.propsSetCount = 0;

      // Define our props get/set hooks
      const that = this;
      Object.defineProperty(Component.prototype, 'props', {
        get: function () {
          return that.props;
        },
        set: function (_props) {
          that.propsSetCount += 1;
          that.props = _props;
        }
      });
    });
    after(function cleanup () {
      delete PostsApp.prototype.props;
      delete this.props;
      delete this.propsSetCount;
    });
  }
};

// Start our tests
describe.only('A request to GET /posts', function () {
  describe('with an empty set of posts', function () {
    httpUtils.save({
      url: serverUtils.getUrl('/posts'),
      expectedStatusCode: 200
    });

    it('renders PostsApp and outputs the same state', function () {
      expect(this.$('body').text()).to.contain('No posts exist yet. Create one via "Create Post"');
    });
    it('provides browsers state with no posts', function () {
      expect(this.$('script').html()).to.contain('window.__PRELOADED_STATE__ = {"posts":[]}');
    });
  });

  describe('with multiple posts and comments', function () {
    testUtils.setFixtures([dbFixtures.POST_WITH_COMMENTS, dbFixtures.POST_ANOTHER]);
    httpUtils.save({
      url: serverUtils.getUrl('/posts'),
      expectedStatusCode: 200
    });

    it('shows posts and comments', function () {
      expect(this.$('body').text()).to.contain('This is an example post');
      expect(this.$('body').text()).to.contain('This is an example comment');
      expect(this.$('body').text()).to.contain('This is another example comment');
      expect(this.$('body').text()).to.contain('This is another example post');
    });
    it('provides browsers state with posts and comments', function () {
      expect(this.$('script').html()).to.contain('window.__PRELOADED_STATE__ = {"posts":[{');
      expect(this.$('script').html()).to.contain('"content":"This is an example post"');
      expect(this.$('script').html()).to.contain('"content":"This is an example comment"');
    });
  });
});
