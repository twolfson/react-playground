// Load in our dependencies
const React = require('react');
const PropTypes = require('prop-types');

const {Layout} = require('./components/layout');

// Export our view
module.exports = class RootView extends React.Component {
  static propTypes = {
    email: PropTypes.string
  };

  render() {
    return (
      <Layout title="react-playground">
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
          <a href="/posts">Go to posts</a>
        </p>
        <p>
          <a href="/logout">Log out</a>
        </p>
      </Layout>
    );
  }
}
