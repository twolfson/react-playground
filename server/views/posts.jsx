// Load in our dependencies
import React from 'react';

import {Layout} from './components/layout';

// Export our view
export default class PostsView extends React.Component {
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
