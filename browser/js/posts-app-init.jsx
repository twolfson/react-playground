// Load in our dependencies
const React = require('react');
const ReactDOM = require('react-dom');

const PostsApp = require('../../common/components/posts-app');

// When our page loads
window.addEventListener('DOMContentLoaded', function handleReady () {
  // Find our target element
  let targetEl = document.querySelector('#main');
  if (!targetEl) { throw new Error('Unable to find our target element'); }

  // Output our content
  const preloadedState = window.__PRELOADED_STATE__;
  if (!preloadedState) { throw new Error('Preloaded state wasn\'t defined'); }
  delete window.__PRELOADED_STATE__;
  ReactDOM.render(<PostsApp posts={preloadedState.posts} />, targetEl);
});
