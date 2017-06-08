// Define our configurations
exports.common = {
};

exports.development = {
  listen: {
    hostname: 'localhost',
    port: 5000
  }
};
exports.development.url = {
  internal: {
    protocol: 'http',
    hostname: 'localhost',
    port: exports.development.listen.port
  },
  external: {
    protocol: 'http',
    hostname: 'localhost',
    port: exports.development.listen.port
  }
};
exports.development.webpackDevServerUrl = {
  protocol: 'http',
  hostname: 'localhost',
  // LiveReload (35729) + 1
  port: 35730
};

exports.test = {
  listen: {
    hostname: 'localhost',
    port: 5001
  }
};
exports.test.url = {
  internal: {
    protocol: 'http',
    hostname: exports.test.listen.hostname,
    port: exports.test.listen.port
  },
  external: {
    protocol: 'https',
    hostname: 'react-playground.test'
  }
};
