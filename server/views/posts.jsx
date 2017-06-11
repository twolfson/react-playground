// Load in our dependencies
const React = require('react');

const {Layout} = require('./components/layout');

// Export our view
module.exports = class PostsView extends React.Component {
  render() {
    const {url, webpackDevServerUrl} = this.props;
    return (
      <Layout title="react-playground posts">
        <h1>react-playground posts</h1>
        <div id="main">Loading...</div>
        {webpackDevServerUrl ? (
          <script src={`${url.format(webpackDevServerUrl)}/browser-dist/js/posts-container.js`} />
        ) : (
          <script src="/browser-dist/js/posts-container.js" />
        )}
      </Layout>
    );
  }
}
