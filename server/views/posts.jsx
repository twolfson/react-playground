// Load in our dependencies
const _ = require('underscore');
const jsStringify = require('js-stringify');
const PropTypes = require('prop-types');
const React = require('react');

const Layout = require('./components/layout');
const PostsApp = require('../../common/components/posts-app');

// Export our view
module.exports = class PostsView extends React.Component {
  // TODO: Resolve query automatically instead of hardcoding it
  // TODO: What if we ditch propTypes dance and always use `__PRELOADED_STATE__` between both server/browser?
  static graphqlQuery = PostsApp.graphqlQuery;
  static propTypes = {
    // TODO: Automatically generate proptypes from graphqlQuery?
    // TODO: Pull proptypes from `PostsApp` component
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
        <div id="main">
          <PostsApp posts={this.props.posts}></PostsApp>
        </div>
        {/* DEV: jsStringify escapes HTML entities to their `\u` equivalent */}
        {/* https://github.com/pugjs/js-stringify */}
        <script dangerouslySetInnerHTML={{
          __html: `window.__PRELOADED_STATE__ = ${
            jsStringify(_.pick(this.props, 'posts'))}`
        }} />
        <script src="/browser-dist/js/posts-app-init.js" />
      </Layout>
    );
  }
};
