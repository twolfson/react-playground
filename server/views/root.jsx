// Load in our dependencies
import React from 'react';

// Export our view
export default class RootView extends React.Component {
  // TODO: Add propTypes
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
