// Load in our dependencies
const {expect} = require('chai');
const React = require('react');

const reactUtils = require('./utils/react');

// Define our tests
describe('A PostApp component', function () {
  describe('with no content', function () {
    reactUtils.mount(function () {
      return (<h1>Hi</h1>);
    });

    it('renders empty content', function () {
      expect(this.$el.text()).to.equal('Hi');
    });
  });
});
