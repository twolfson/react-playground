// Load in our dependencies
import React from 'react';

import {Layout} from './components/layout';

// Export our view
export default class PostsView extends React.Component {
  render() {
    return (
      <Layout title="react-playground posts">
        <h1>react-playground posts</h1>
        <div id="main">Loading...</div>
        {/* TODO: Move to `browser-dist` */}
        <script src="/browser/posts.js" />
      </Layout>
    );
  }
}
