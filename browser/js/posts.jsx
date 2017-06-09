import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './counter';

const rootEl = document.getElementById('main');
const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  );

render(Counter);
if (module.hot) module.hot.accept('./counter', () => render(Counter));
