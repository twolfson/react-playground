// Load in our dependencies
const React = require('react');

// Server side rendered strategy
//   - Get server side render working only (remove browser render temporarily)
//   - Update browser code to recognize existing element as already rendered
//   - Add usage of same query somehow from browser
//       Need to figure out how to get child render's query... unless we ignore that?
//       Maybe skip to using Relay so we have a point of reference

// Define our application component
module.exports = class PostsApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: null,
      isLoading: false,
      // TODO: Perform all hydration via single store
      //   Also data should be normalized, not pre-nested
      // DEV: PRELOADED_STATE should be keyed by `el.key` not a singleton PostsApp
      //   but this is a proof of concept
      // TODO: Add test for preloaded element
      posts: props.posts
      // isLoading: true,
      // posts: global.__PRELOADED_STATE__ ? global.__PRELOADED_STATE__.PostsApp.posts : []
    };
  }

  componentWillMount() {
    // TODO: Re-enable browser fetching of data
    // if (!global.__PRELOADED_STATE__) {
    if (false) {
      this._fetchData();
    }
  }

  static graphqlQuery = `
    query {
      posts {
        id
        content
        comments {
          id
          content
        }
      }
    }
  `;

  _fetchData() {
    // Reset our state
    this.setState({
      err: null,
      isLoading: true
    });

    // Generate our XHR
    // TODO: Relocate state fetching to a singleton store (e.g. Redux)
    // http://youmightnotneedjquery.com/#post
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/graphql', true /* async */);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      query: this.constructor.graphqlQuery
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
            {/* TODO: Add support for creating a post via GraphQL */}
            <button type="submit" disabled="disabled">Create post (support pending)</button>
          </div>
        </form>
        <h2>Existing posts</h2>
        {/* TODO: Load posts dynamically via GraphQL and server-side render that shiz */}
        {this.state.isLoading ? (
          <p>Loading...</p>
        ) : (
          this.state.posts.length === 0 ? (
            <p>No posts exist yet. Create one via "Create Post"</p>
          ) : (
            this.state.posts.map((post) => {
              return (
                // Ideally this would be a `<p>` but React complains about nesting div's in p's which is fair
                <div key={post.id} style={{marginBottom: '20px'}}>
                  <div className="post__title"><strong>Post:</strong> {post.content}</div>
                  <div className="post__comments"
                      style={{marginLeft: '10px', borderLeft: '4px solid #CCC', paddingLeft: '5px'}}>
                    {/* Do nothing on no comments */}
                    {post.comments.map((comment) => {
                      return (
                        <div key={comment.id}>{comment.content}</div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )
        )}
      </div>
    );
  }
};
