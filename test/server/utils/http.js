// Taken from https://gist.github.com/twolfson/f27eb310410b3fe28f0060b43d58d33e
// Load in our dependencies
const assert = require('assert');

const _ = require('underscore');
const async = require('async');
const cheerio = require('cheerio');
const request = require('request');

const serverUtils = require('./server');

const kueQueue = {}; // Loaded via server utils, scrubbed for GitHub

// Copy over utilities from request-mocha
// https://github.com/uber-archive/request-mocha/blob/0.2.0/lib/request-mocha.js
// DEV: We use copy/paste as it's easier to integrate Cheerio parsing
export const _save = function (options) {
  return function _saveFn (done) {
    // Save our context for later
    const that = this;

    // If we haven't decided on following a redirect, default to nope
    // DEV: This prevents us following redirect to login accidentally with a 200
    if (options.followRedirect === undefined) {
      options.followRedirect = false;
    }

    // If there is a form generator, then run it
    if (options.htmlForm) {
      // Verify we have a body to base on
      assert(this.$, 'Expected `this.$` to be defined from previous `save` but it was not. ' +
        'Please use `httpUtils.save` before using `htmlForm` in a subsequent request');

      // Fallback form selector to target URL (e.g. `form[action=/add-application]`)
      let hostlessUrl = options.url.replace(serverUtils.getUrl(''), '');
      let htmlFormSelector = options.htmlFormSelector || 'form[action="' + _.escape(hostlessUrl) + '"]';

      // Resolve and verify our form exists
      let $htmlForm = this.$(htmlFormSelector);
      assert($htmlForm.length, 'No HTML form was found under selector "' + htmlFormSelector + '"');
      let actualHttpMethod = ($htmlForm.attr('method') || 'GET');
      assert.strictEqual(actualHttpMethod.toUpperCase(), options.method.toUpperCase(),
        'Expected HTML form to use method "' + options.method + ' but it was using "' + actualHttpMethod + '". ' +
        'Please verify `httpUtils.save` is using expected `method` parameter');

      // If `options.htmlForm` is `true`, then use the form as is
      if (options.htmlForm === true) {
        options.htmlForm = _.identity;
      }

      // If `options.htmlForm` is a function, then run it
      let formData;
      if (typeof options.htmlForm === 'function') {
        formData = (options.htmlForm.call(this, $htmlForm) || $htmlForm).serialize();
      // Otherwise, if it's an object, then fill out content based on form
      } else if (typeof options.htmlForm === 'object') {
        let validateHtmlFormDifferent = options.validateHtmlFormDifferent;
        let validateHtmlFormDifferentExclude = (validateHtmlFormDifferent && validateHtmlFormDifferent.exclude) || [];
        Object.keys(options.htmlForm).forEach(function fillOutInput (name) {
          // Find our input/textarea
          let $inputOrTextarea = $htmlForm.find('[name=' + name + ']');

          // If the input is a radio
          let val = options.htmlForm[name];
          if ($inputOrTextarea.attr('type') === 'radio') {
            // If we should validate the value is going to change, then validate it
            if (validateHtmlFormDifferent !== false && validateHtmlFormDifferentExclude.indexOf(name) === -1) {
              let $checkedInput = $inputOrTextarea.filter(':checked');
              assert.notEqual($checkedInput.val(), val,
                'input[type=radio] with name "' + name + '" is already checked for "' + val + '". ' +
                'Please use different form data, exclude it, or disable `validateHtmlFormDifferent`');
            }

            // Perform our normal update
            $inputOrTextarea.removeAttr('checked');
            let $selectedInput = $inputOrTextarea.filter('[value=' + val + ']');
            assert.strictEqual($selectedInput.length, 1,
              'Unable to find input[type=radio] with name "' + name + '" and value "' + val + '"');
            $selectedInput.attr('checked', true);
          // Otherwise, update it as a textbox
          } else {
            assert.strictEqual($inputOrTextarea.length, 1, 'Unable to find input/textarea with name "' + name + '"');
            if (options.validateHtmlFormDifferent !== false && validateHtmlFormDifferentExclude.indexOf(name) === -1) {
              assert.notEqual($inputOrTextarea.val(), val,
                'Form data for input/textarea "' + name + '" already has value "' + val + '". ' +
                'Please use different form data, exclude it, or disable `validateHtmlFormDifferent`');
            }
            $inputOrTextarea.val(val);
          }
        });
        formData = $htmlForm.serialize();
      // Otherwise, error out
      } else {
        throw new Error('Unrecognized htmlForm type "' + typeof options.htmlForm + '". ' +
          'Please use a function or object');
      }

      // Complete and serialize our form
      // DEV: We allow for returning a new element as the form or using the original
      if (options.method.toUpperCase() === 'GET') {
        options.url += '?' + formData;
      } else {
        options.form = formData;
      }
    }

    // If there is a CSRF form to generate, then collect our CSRF token and generate a form
    if (options.csrfForm) {
      assert(options.jar, 'Expected `csrfForm` to be used in a `httpUtils.session` context but it was not');
      return request({
        jar: options.jar,
        url: serverUtils.getUrl('/add-application/save-for-later')
      }, function handleRequest (err, res, body) {
        // If there was an error, callback with it
        if (err) {
          return done(err);
        }

        // Otherwise, scrape our CSRF token and pass it along as a form
        assert.strictEqual(res.statusCode, 200);
        let csrfToken = cheerio.load(body)('input[name=x-csrf-token]').val();
        let csrfForm = _.defaults({
          'x-csrf-token': encodeURIComponent(csrfToken)
        }, options.csrfForm);
        assert(csrfToken);
        options = _.defaults({
          form: csrfForm
        }, options);

        // Continue to our request
        next();
      });
    // Otherwise, make our request
    } else {
      return next();
    }

    // Make our request
    function next() {
      async.parallel([
        function waitForJobs (cb) {
          // If we have no jobs to wait for, callback now
          if (!options.waitForJobs) {
            return process.nextTick(cb);
          }

          // Otherwise, wait for `n` jobs to complete
          // https://github.com/Automattic/kue/tree/v0.11.5#job-events
          // https://github.com/Automattic/kue/tree/v0.11.5#queue-events
          let removeListeners = function () {
            /* eslint-disable no-use-before-define */
            kueQueue.removeListener('job failed', handleJobFailed);
            kueQueue.removeListener('job complete', handleJobComplete);
            /* eslint-enable no-use-before-define */
          };
          let handleJobFailed = function (id, err, result) {
            removeListeners();
            cb(err);
          };
          /* eslint-disable indent */
          let handleJobComplete = _.after(options.waitForJobs,
              function handleJobCompleteFn (id, result) {
            // Unsubscribe our listeners and callback
            removeListeners();
            cb();
          });
          /* eslint-enable indent */
          kueQueue.on('job failed', handleJobFailed);
          kueQueue.on('job complete', handleJobComplete);
        },
        function makeRequest (cb) {
          let req = request(options, function handleRequest (err, res, body) {
            // Save our results to `this` context
            that.err = err;
            that.req = req;
            that.res = res;
            that.body = body;

            // Expose convenince redirect information
            that.redirects = [];
            that.lastRedirect = undefined;
            if (that.req && that.req._redirect) {
              that.redirects = that.req._redirect.redirects;
              that.lastRedirect = that.redirects[that.redirects.length - 1];
            }

            // Verify status code is as expected (default of 200)
            // DEV: `expectedStatusCode` can be opted out via `null`
            let expectedStatusCode = options.expectedStatusCode !== undefined ? options.expectedStatusCode : 200;
            if (expectedStatusCode) {
              assert.strictEqual(err, null);
              if (res.statusCode !== expectedStatusCode) {
                let assertionMsg = 'Expected status code "' + expectedStatusCode + '" ' +
                  'but received "' + res.statusCode + '" and body "' + body + '"';
                try {
                  let errorMsg = cheerio.load(body)('#_error').text() ||
                    cheerio.load(body)('#validation-errors').text();
                  assertionMsg = 'Expected status code "' + expectedStatusCode + '" but ' +
                  'received "' + res.statusCode + '" at URL "' + (options.url || options)  + '", ' +
                  'error "' + errorMsg + '", and body "' + body.slice(0, 300) + '..."';
                } catch (loadErr) {
                  // Ignore error (assuming we can't parse body or find error
                }
                assert.strictEqual(res.statusCode, expectedStatusCode, assertionMsg);
              }
            }

            // If there was a request to parse the response as HTML, then do it
            if (options.parseHTML !== false) {
              try {
                that.$ = cheerio.load(body);
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Tried to parse response body as HTML but failed. ' +
                  'If response should not be parsed, set `parseHTML` to `false`');
                throw err;
              }
            }
            // If there was a request to parse the response as JSON, then do it
            if (options.parseJSON === true) {
              try {
                that.json = JSON.parse(body);
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Tried to parse response body as JSON but failed. ' +
                  'If response should not be parsed, set `parseJSON` to `false`');
                throw err;
              }
            }

            // Callback
            cb();
          });
        }
      ], done);
    }
  };
};
export const _saveCleanup = function () {
  return function _saveCleanupFn () {
    delete this.err;
    delete this.req;
    delete this.res;
    delete this.body;
    delete this.redirects;
    delete this.lastRedirect;
    delete this.$;
    delete this.json;
  };
};
export const save = function (options) {
  before(_save(options));
  after(_saveCleanup(options));
};

// Define session-based methods
export const session = {
  _save: function (options) {
    return function saveFn (done) {
      // Verify we have a cookie jar to leverage
      assert(this.jar, '`this.jar` does not exist. Please use `exports.session.login` ' +
        'to let us know when a new session is beginning.');

      // If our parameter is a string, upcast it to an object
      if (typeof options === 'string') {
        options = {
          jar: this.jar,
          url: options
        };
      // Otherwise, add on our jar
      } else {
        options = _.defaults({
          jar: this.jar
        }, options);
      }

      // Make our request
      return _save(options).call(this, done);
    };
  },
  save: function (options) {
    before(session._save(options));
    after(_saveCleanup(options));
    return this;
  },
  init: function () {
    before(function initFn () {
      // If there already is a session, complain and leave
      assert(!this.jar, '`this.jar` already exists for `httpUtils.session` ' +
        '(meaning another session has been started). Please terminate the other session or reuse this one.');

      // Otherwise, generate a new cookie jar
      this.jar = request.jar();
    });
    after(function cleanup () {
      delete this.jar;
    });

    // Return this for a fluent interface
    return this;
  },
  // Define shorthand login with default candidate
  login: function () {
    return this.loginAs('dev-user@react-playground.test');
  },
  loginAs: function (email) {
    before(function loginAsFn () {
      // Verify a session already has been started
      assert(this.jar, '`this.jar` doesn\'t exists for `httpUtils.session` ' +
        '(meaning a session hasn\'t been started). Please begin a session before logging in.');
    });
    // Visit our login page and login with our given email
    session
      .save({url: serverUtils.getUrl('/'), expectedStatusCode: 200})
      .save({
        method: 'POST', url: serverUtils.getUrl('/login'),
        htmlForm: {email: email},
        expectedStatusCode: 302
      });

    // Return this for a fluent interface
    return this;
  }
};

// Define GraphQL based methods
function wrapSaveWithGraphQL(saveFn) {
  return function wrapSaveWithGraphQLFn (options) {
    // Construct our body
    assert(options.query);
    let body = {query: options.query};
    if (options.variables) { body.variables = options.variables; }

    // Extend our options with GraphQL info
    // TODO: Add error checking to GraphQL responses (e.g. export nice error messages)
    options = _.defaults({
      method: 'POST',
      url: serverUtils.getUrl('/graphql'),
      headers: _.defaults({
        'Content-Type': 'application/json'
      }, options.headers),
      body: JSON.stringify(body),
      parseJSON: true
    }, options);

    // Make a normal request
    saveFn(options);

    // Afterwards, verify we have expected errors
    before(function validateErrorMessage () {
      let errors = this.json.errors || [];
      if (options.expectedError !== undefined) {
        assert.strictEqual(errors.length, 1);
        assert.strictEqual(errors[0].message, options.expectedError.message);
        assert.strictEqual(errors[0].path.length, 1);
        assert.strictEqual(errors[0].path[0], options.expectedError.path);
      } else {
        assert.deepEqual(errors, []);
      }
    });

    // Return `this` for a fluent interface
    return this;
  };
}
export const graphql = wrapSaveWithGraphQL(save);
session.graphql = wrapSaveWithGraphQL(session.save);
