// Load in our dependencies
const {expect} = require('chai');
const {mount} = require('enzyme');
const React = require('react');

// Define our tests
describe('A PostApp component', function () {
  describe('with no content', function () {
    it('renders empty content', function () {
      const wrapper = mount(<h1>Hi</h1>);
      expect(wrapper.text()).to.equal('Hi');
    });
  });
});
