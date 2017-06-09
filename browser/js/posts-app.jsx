// Load in our dependencies
import React from 'react';

// Define our application component
export default class PostsApp extends React.Component {
  render() {
    return (
      <div>
        {/* GraphQL form */}
        <form>
          <h1>Submit a new post</h1>
          <div>
            <label htmlFor="content">Content:</label>
            <input type="text" placeholder="Content goes here"></input>
          </div>
          <div>
            <button type="submit">Create post</button>
          </div>
        </form>
        <h2>Existing posts</h2>
        {/* TODO: Load posts dynamically via GraphQL and server-side render that shiz */}
        {/* TODO: Start with React component that's browser only */}
      </div>
    );
  }
}
