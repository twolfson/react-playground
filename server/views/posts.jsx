// Load in our dependencies
const React = require('react');

const Layout = require('./components/layout');

// Export our view
module.exports = class PostsView extends React.Component {
  render() {
    return (
      <Layout title="react-playground posts">
        <h1>react-playground posts</h1>
        <div id="main">Loading...</div>
        <script src="/browser-dist/js/posts-container.js" />
      </Layout>
    );
  }
};
