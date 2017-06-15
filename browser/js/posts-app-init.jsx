// Load in our dependencies
const React = require('react');
const ReactDOM = require('react-dom');

const PostsApp = require('./posts-app');

// When our page loads
window.addEventListener('DOMContentLoaded', function handleReady () {
  // Find our target element
  let targetEl = document.querySelector('#main');
  if (!targetEl) { throw new Error('Unable to find our target element'); }

  // Output our content
  ReactDOM.render(<PostsApp />, targetEl);
});
