// Load in our dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import Counter from './counter';

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
  render(Counter);

  // If we have HMR enabled, handle reloads
  /* eslint-disable no-restricted-globals */
  if (module.hot) {
    module.hot.accept('./counter', () => {
      render(Counter);
    });
  }
  /* eslint-enable no-restricted-globals */
});
