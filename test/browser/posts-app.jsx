// Load in our dependencies
const {expect} = require('chai');
const {mount} = require('enzyme');
const React = require('react');

// Define our test helpers
const testUtils = {
  init(renderFn) {
    let mountEl;
    before(function runRenderFn () {
      // Create a fixture entry point
      mountEl = document.createElement('div');
      document.body.appendChild(mountEl);

      // Render our React component and bind it to the page
      this.$el = mount(renderFn(), {
        attachTo: mountEl
      });
    });
    after(function cleanup () {
      this.$el.detach();
      delete this.$el;
      document.body.removeChild(mountEl);
    });
  }
};

// Define our tests
describe('A PostApp component', function () {
  describe('with no content', function () {
    testUtils.init(function () {
      return (<h1>Hi</h1>);
    });

    it('renders empty content', function () {
      expect(this.$el.text()).to.equal('Hi');
    });
  });
});
