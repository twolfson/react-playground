// Load in our dependencies
const React = require('react');
const ReactDOM = require('react-dom');
const {AppContainer} = require('react-hot-loader');

const PostsApp = require('./posts-app');

// When our page loads
window.addEventListener('DOMContentLoaded', function handleReady () {
  // Find our target element
  let targetEl = document.querySelector('#main');
  if (!targetEl) { throw new Error('Unable to find our target element'); }

  // Output content with HMR wrapper
  const render = (Component) => {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      targetEl);
  };
  render(PostsApp);

  // If we have HMR enabled, handle reloads
  /* eslint-disable no-restricted-globals */
  if (module.hot) {
    module.hot.accept('./posts-app', () => {
      render(PostsApp);
    });
  }
  /* eslint-enable no-restricted-globals */
});
