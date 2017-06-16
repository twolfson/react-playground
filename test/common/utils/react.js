// Load in our dependencies
const assert = require('assert');

const {mount, render} = require('enzyme');

// Define our test helpers
exports.init = function (renderFn) {
  return typeof window !== 'undefined' ?
    exports.mount(renderFn) : exports.render(renderFn);
};

let loggedDebugNotice = false;
exports.mount = function (renderFn) {
  // Verify we aren't in the server
  assert.notEqual(typeof window, 'undefined',
    '`reactUtils.mount` is being run in a non-browser context. ' +
    'Please use `reactUtils.init` instead as we won\'t be running a global document on our server ' +
    'as that can lead to requests using the same document');

  // Define our mount helpers
  let mountEl;
  before(function mountFn () {
    // Create a fixture entry point
    assert(!this.$el, 'Expected `this.$el` to be undefined but it wasn\'t. ' +
      'Please only use 1 `reactUtils` at a time');
    mountEl = document.createElement('div');
    document.body.appendChild(mountEl);

    // Render our React component and bind it to the page
    this.$el = mount(renderFn(), {
      attachTo: mountEl
    });
  });

  after(function cleanup () {
    // Taken from https://github.com/twolfson/multi-image-mergetool/blob/1.32.1/test/browser/utils/application.js#L128-L147
    // If we are on the debug page, expose everything
    if (window.location.pathname === '/debug.html')  {
      // If only 1 test is running, expose everything and stop
      if (window.mocha.options.hasOnly) {
        // eslint-disable-next-line no-console
        console.info('/debug.html and `hasOnly` detected, ' +
          'exposing `window.$el`');
        window.$el = this.$el;
        return;
      }

      // Notify user about debugging
      if (!loggedDebugNotice) {
        // eslint-disable-next-line no-console
        console.info('/debug.html detected but no `.only`. ' +
          'To visually debug tests/stop cleanup, add a `.only` to a test suite');
        loggedDebugNotice = true;
      }
    }

    // Perform our cleanup
    this.$el.detach();
    delete this.$el;
    document.body.removeChild(mountEl);
  });
};

exports.render = function (renderFn) {
  // Define our mount helpers
  // DEV: Signature should be `1:1` with `mount` so we can use `init`
  before(function _renderFn () {
    assert(!this.$el, 'Expected `this.$el` to be undefined but it wasn\'t. ' +
      'Please only use 1 `reactUtils` at a time');
    this.$el = render(renderFn());
  });
  after(function cleanup () {
    delete this.$el;
  });
};
