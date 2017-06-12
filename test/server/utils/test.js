// Load in our dependencies
const dbFixtures = require('./db-fixtures');

// Define our helpers
exports.setFixtures = function (fixtureNames) {
  before(function setFixturesFn () {
    dbFixtures.setFixtures(fixtureNames);
  });
};
