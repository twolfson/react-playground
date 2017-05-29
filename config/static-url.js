// Define our configurations
export let common = {
};

export let development = {
  listen: {
    hostname: 'localhost',
    port: 5000
  }
};
development.url = {
  internal: {
    protocol: 'http',
    hostname: 'localhost',
    port: development.listen.port
  },
  external: {
    protocol: 'http',
    hostname: 'localhost',
    port: development.listen.port
  }
};

export let test = {
  listen: {
    hostname: 'localhost',
    port: 5001
  }
};
test.url = {
  internal: {
    protocol: 'http',
    hostname: test.listen.hostname,
    port: test.listen.port
  },
  external: {
    protocol: 'https',
    hostname: 'react-playground.test'
  }
};
