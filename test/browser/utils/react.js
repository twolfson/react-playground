// Load in our dependencies
const {mount} = require('enzyme');

// Define our test helpers
let loggedDebugNotice = false;
exports.mount = function (renderFn, options) {
  let mountEl;
  options = options || {};
  before(function runRenderFn (done) {
    // Create a fixture entry point
    mountEl = document.createElement('div');
    document.body.appendChild(mountEl);

    // Set up request listeners
    // TODO: Handle waiting for requests
    const waitForRequests = options.waitForRequests || 0;
    setTimeout(done, 1000);

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
