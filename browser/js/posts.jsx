// Load in our dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import Counter from './counter';

// When our page loads
// window.addEventListener('DOMContentLoaded', function handleReady () {
  // Find our target element
  let targetEl = document.querySelector('#main');
  if (!targetEl) { throw new Error('Unable to find our target element'); }

  // Output content with HMR wrapper
  const render = (Component) => {
    console.log('re-render!');
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      targetEl);
  };
  render(Counter);

  // If we have HMR enabled, handle reloads
  // TODO: Tidy up errors
  if (module.hot) {
    module.hot.accept('./counter', () => {
      console.log('reeeerender');
      console.log('wat', Counter);
      const x = require('./counter').default;
      render(x);
    });
  }
// });
