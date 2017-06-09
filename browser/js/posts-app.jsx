// Load in our dependencies
import React from 'react';

// Define our application component
export default class PostsApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: null,
      isLoading: true,
      posts: []
    };
    this._fetchData();
  }

  _fetchData() {
    // Reset our state
    this.setState({
      err: null,
      isLoading: true
    });

    // Generate our XHR
    // TODO: Add tests for me
    // DEV: We will worry about hydration via props in the next step
    //   Maybe define a singleton state and run `init` on that
    // http://youmightnotneedjquery.com/#post
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/graphql', true /* async */);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      query: `query {
        posts {
          id
          content
          comments {
            id
            content
          }
        }
      }`
    }));

    // Handle our XHR response
    const that = this;
    const saveError = function (err) {
      that.setState({
        err: err,
        isLoading: false
      });
    };
    xhr.onerror = saveError;
    xhr.onload = function () {
      if (xhr.status !== 200) {
        saveError(new Error(
          `Expected status code "200" but got "${xhr.status}" and body "${xhr.responseText}"`));
      } else {
        // TODO: Handle GraphQL errors
        that.setState({
          // TODO: Handle non-JSON
          posts: JSON.parse(xhr.responseText).data.posts,
          isLoading: false
        });
      }
    };
  }

  componentWillUpdate() {
    // window.location.reload();
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
        {this.state.isLoading ? (
          <p>Loading...</p>
        ) : (
          {/* TODO: Handle empty state */}
          this.state.posts.map((post) => {
            return (
              <p>
                <div className="post__title" key={post.id}><strong>Post:</strong> {post.content}</div>
                <div className="post__comments" style={{marginLeft: '20px'}}>
                  {/* TODO: Handle empty state */}
                  {post.comments.map((comment) => {
                    return (
                      <div key={comment.id}>{comment.content}</div>
                    );
                  })}
                </div>
              </p>
            );
          })
        )}
      </div>
    );
  }
}
