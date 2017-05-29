// Based on https://github.com/twolfson/twolfson.com/blob/3.87.0/config/static.js
// Load in our dependencies
import _ from 'underscore';

// DEV: When we want to store secrets, follow SOPS' all-in-one secret convention
//   We prefer it over per-file as we can use aliasing in non-JSON files
//   https://github.com/mozilla/sops/tree/f63597f901f50f07ff72452b4bdb485518b85de7/examples

// Define generic settings
export const common = {
};

export const development = {
  viewCache: false
};

export const test = {
  viewCache: true
};

export const production = {
  viewCache: true
};

// Merge in grouped settings
const configFiles = [
  './static-url'
];
configFiles.forEach(function mergeConfigFile (configFile) {
  // Load our new config
  // DEV: We could refactor with redundant imports but we're fine hacking it for now
  const mainConfig = {common, development, test, production};
  const newConfig = global.require(configFile); // eslint-disable-line global-require

  // Assert that the new config has no repeated keys
  let mainKeys = _.union(
    _.keys(mainConfig.common), _.keys(mainConfig.development),
    _.keys(mainConfig.test), _.keys(mainConfig.production)
  );
  let newKeys = _.union(
    _.keys(newConfig.common), _.keys(newConfig.development),
    _.keys(newConfig.test), _.keys(newConfig.production)
  );
  let sameKeys = _.intersection(mainKeys, newKeys);
  if (sameKeys.length > 0) {
    throw new Error('Duplicate keys found in multiple configs. Expected none. Found: ' + JSON.stringify(sameKeys));
  }

  // Add on the new properties
  _.extend(mainConfig.common, newConfig.common);
  _.extend(mainConfig.development, newConfig.development);
  _.extend(mainConfig.test, newConfig.test);
  _.extend(mainConfig.production, newConfig.production);
});
