// Load in our dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Export our view
// Based on https://github.com/reactjs/express-react-views/tree/v0.10.1
export class Layout extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  render() {
    // Render our content
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
        </head>
        <body>
          {this.props.children}
        </body>
      </html>
    );
  }
}
