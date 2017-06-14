// Load in our dependencies
const PropTypes = require('prop-types');
const React = require('react');

const Layout = require('./components/layout');
// TODO: Move shared components to `common`/`shared`/`browser/server` folder
const PostsApp = require('../../browser/js/posts-app');

// Export our view
module.exports = class PostsView extends React.Component {
  // TODO: Resolve query automatically instead of hardcoding it
  // TODO: What if we ditch propTypes dance and always use `__PRELOADED_STATE__` between both server/browser?
  static graphqlQuery = PostsApp.graphqlQuery;
  static propTypes = {
    // TODO: Automatically generate proptypes from graphqlQuery?
    posts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      comments: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
      }))
    })).isRequired
  };

  render() {
    return (
      <Layout title="react-playground posts">
        <h1>react-playground posts</h1>
        {/* TODO: Add back our browser script */}
        <PostsApp posts={this.props.posts}></PostsApp>
      </Layout>
    );
  }
};
