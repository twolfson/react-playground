// Load in our dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Export our view
export default class RootView extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>react-playground</title>
        </head>
        <body>
          <h1>react-playground</h1>
          <p>
            {this.props.email
              ? `You are logged in as: ${this.props.email}`
              : 'You are not logged in'}
          </p>
          {/* TODO: Add CSRF to form */}
          <form method="POST" action="/login">
            <div>
              <label for="email">Email: </label>
              <input name="email"/>
            </div>
            <div>
              <button type="submit">Login</button>
            </div>
          </form>
          <p>
            <a href="/logout">Log out</a>
          </p>
        </body>
      </html>
    );
  }
};
// TODO: Get `static` propTypes working so it's not weirdly placed
// TODO: Get propTypes to throw error on mismatch instead of `console.warn`
RootView.propTypes = {
  email: PropTypes.string
};
