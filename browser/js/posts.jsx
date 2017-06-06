// Load in our dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

// Define our application component
class PostsApp extends React.Component {
  render() {
    return (
      <div>
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
      </div>
    );
  }
}

// When our page loads
window.addEventListener('DOMContentLoaded', function handleReady () {
  // Find our target element
  let targetEl = document.querySelector('#main');
  if (!targetEl) { throw new Error('Unable to find our target element'); }

  // Output content with HMR wrapper
  ReactDOM.render(
    <AppContainer>
      <PostsApp />
    </AppContainer>,
    targetEl);

  // If we have HMR enabled, handle reloads
});
