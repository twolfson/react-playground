// Load in dependencies
const assert = require('assert');
const fs = require('fs');

const {expect} = require('chai');

const PostsApp = require('../../browser/js/posts-app');
const dbFixtures = require('./utils/db-fixtures');
const httpUtils = require('./utils/http');
const serverUtils = require('./utils/server');
const testUtils = require('./utils/test');

// Define our test helper
const renderUtils = {
  spyProps: function (Component) {
    before(function spyPropsFn () {
      // Define our location to save props
      assert.strictEqual(this.propsArgs, undefined,
        'Expected `renderUtils.spyProps` to not be called multiple times but it was');
      this.propsArgs = [];

      // Define our props get/set hooks
      const that = this;
      Object.defineProperty(Component.prototype, 'props', {
        configurable: true,
        get: function () {
          return that.propsArgs[that.propsArgs.length - 1];
        },
        set: function (_props) {
          that.propsArgs.push(_props);
        }
      });
    });
    after(function cleanup () {
      delete PostsApp.prototype.props;
      delete this.propsArgs;
    });
  }
};

// Start our tests
describe.only('A request to GET /posts', function () {
  describe('with an empty set of posts', function () {
    renderUtils.spyProps(PostsApp);
    httpUtils.save({
      url: serverUtils.getUrl('/posts'),
      expectedStatusCode: 200
    });

    it('renders PostsApp and outputs the same state', function () {
      // Verify props is non-empty
      // DEV: We're unsure of where the additional post comes from
      expect(this.propsArgs).to.have.lengthOf(2);

      // Verify preloaded state is non-empty
      const preloadedStateMatch = this.body.match(/window.__PRELOADED_STATE__ = ({[^<]+})/);
      expect(preloadedStateMatch).to.not.equal(null);
      const preloadedState = JSON.parse(preloadedStateMatch[1]);

      // Compare our props and preloaded state to verify they're 1:1 and define their contract
      expect(this.propsArgs[0]).to.deep.equal(preloadedState);
      // TODO: Move contract into a conditional utility (same assert in CI mechanism as other contract)
      fs.writeFileSync(__dirname + '/../test-files/render-contracts/posts-app-empty.json',
        JSON.stringify(preloadedState, null, 2));
    });
  });

  describe('with multiple posts and comments', function () {
    testUtils.setFixtures([dbFixtures.POST_WITH_COMMENTS, dbFixtures.POST_ANOTHER]);
    renderUtils.spyProps(PostsApp);
    httpUtils.save({
      url: serverUtils.getUrl('/posts'),
      expectedStatusCode: 200
    });

    it('renders PostsApp and outputs the same state', function () {
      // Verify props is non-empty
      // DEV: We're unsure of where the additional post comes from
      expect(this.propsArgs).to.have.lengthOf(2);

      // Verify preloaded state is non-empty
      const preloadedStateMatch = this.body.match(/window.__PRELOADED_STATE__ = ({[^<]+})/);
      expect(preloadedStateMatch).to.not.equal(null);
      const preloadedState = JSON.parse(preloadedStateMatch[1]);

      // Compare our props and preloaded state to verify they're 1:1 and define their contract
      expect(this.propsArgs[0]).to.deep.equal(preloadedState);
      // TODO: Move contract into a conditional utility (same assert in CI mechanism as other contract)
      fs.writeFileSync(__dirname + '/../test-files/render-contracts/posts-app-full.json',
        JSON.stringify(preloadedState, null, 2));
    });
  });
});
