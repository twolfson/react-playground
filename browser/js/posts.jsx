import assert from 'assert';
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import Counter from './counter';

const targetEl = document.querySelector('#main');
assert(targetEl, 'Unable to find our target element');
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    targetEl);
};

render(Counter);
if (module.hot) {
  module.hot.accept('./counter', () => {
    render(Counter);
  });
}
