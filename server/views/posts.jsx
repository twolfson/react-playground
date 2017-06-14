// Load in our dependencies
const React = require('react');

const Layout = require('./components/layout');
// TODO: Move shared components to `common`/`shared`/`browser/server` folder
const PostsApp = require('../../browser/js/posts-app');

// Export our view
module.exports = class PostsView extends React.Component {
  graphqlQuery = PostsApp.prototype.graphqlQuery;

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
