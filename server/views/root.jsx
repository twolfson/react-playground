// Export our view
export default function(props) {
  // TODO: Transition to React
  // TODO: Escape email to prevent XSS
  return (
    '<head>' +
      '<title>react-playground</title>' +
    '</head>' +
    '<body>' +
      '<h1>react-playground</h1>' +
      '<p>' +
        (props.email ? 'You are logged in as: ' + props.email : 'You are not logged in') +
      '</p>' +
      // TODO: Add CSRF to form
      '<form method="POST" action="/login">' +
        '<div>' +
          '<label for="email">Email: </label>' +
          '<input name="email"/>' +
        '</div>' +
        '<div>' +
          '<button type="submit">Login</button>' +
        '</div>' +
      '</form>' +
      '<p>' +
        '<a href="/logout">Log out</a>' +
      '</p>' +
    '</body>'
  );
};
