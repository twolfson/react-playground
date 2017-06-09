// Load in our dependencies
import React from 'react';

// Define our application component
export default class PostsApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {posts: [], loading: true};
    this._fetchData();
  }

  _fetchData() {
    // Fetch our posts from GraphQL
    // TODO: Add tests for me
    // DEV: We will worry about hydration via props in the next step
    //   Maybe define a singleton state and run `init` on that
    console.log('hiiii');
  }

  componentWillUpdate() {
    window.reload();
  }

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
