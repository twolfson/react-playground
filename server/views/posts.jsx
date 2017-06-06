// Load in our dependencies
import React from 'react';

import {Layout} from './components/layout';

// Export our view
export default class PostsView extends React.Component {
  render() {
    return (
      <Layout title="react-playground posts">
        <h1>react-playground posts</h1>
        {/* GraphQL form */}
        <form>
          <h2>Submit a new post</h2>
          <div>
            <label for="content">Content:</label>
            <input type="text" placeholder="Content goes here"></input>
          </div>
          <div>
            <button type="submit">Create post</button>
          </div>
        </form>
        <h2>Existing posts</h2>
        {/* TODO: Load posts dynamically via GraphQL and server-side render that shiz */}
        {/* TODO: Start with React component that's browser only */}
      </Layout>
    );
  }
}
