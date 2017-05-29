// Define a simple config for now
var config = {};
config.listen = {
  port: 5000,
  hostname: 'localhost'
};
config.url = {
  internal: {
    protocol: 'http',
    hostname: 'localhost',
    port: config.listen.port
  }
  external: {
    protocol: 'http',
    hostname: 'localhost',
    port: config.listen.port
  }
};

// Define our export functionality
exports.getConfig = function () {
  return _.clone(config);
};
