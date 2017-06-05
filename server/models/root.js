// Load in our dependencies
import _ from 'underscore';
import httpErrors from 'http-errors';
import {GraphQLObjectType, GraphQLString} from 'graphql';
import uuidV4 from 'uuid/v4';

// Define our root queries and mutations
const rootContainer = {
  queries: {
    status: {
      type: GraphQLString,
      description: 'Sanity field for verifying a query works',
      resolve(parentValue, args, req) {
        return 'OK';
      }
    },
    echo: {
      type: GraphQLString,
      description: 'Echo input argument as output value',
      args: {
        content: {
          description: 'Value to output',
          type: GraphQLString
        }
      },
      resolve(parentValue, args, req) {
        return args.content;
      }
    },
    whoami: {
      type: GraphQLString,
      description: 'Email address of logged in user. If not logged in, this will 403',
      resolve(parentValue, args, req) {
        // If the user is logged out, then reject them
        // TODO: Create a helper resolver
        if (!req.session.email) {
          throw new httpErrors.Forbidden();
        }

        // Otherwise, reply with their email
        return req.session.email;
      }
    }
  },
  mutations: {}
};

// Merge our queries/mutations
const graphQLContainers = [
  './post'
];
graphQLContainers.forEach(function mergeGraphQLContainer (filepath) {
  // Load our container
  // DEV: We could refactor with redundant imports but we're fine hacking it now
  const newContainer = require(filepath); // eslint-disable-line global-require, no-restricted-globals

  // Assert that the new config has no repeated keys
  let rootKeys = _.union(
    _.keys(rootContainer.queries), _.keys(rootContainer.mutations)
  );
  let newKeys = _.union(
    _.keys(newContainer.queries), _.keys(newContainer.mutations)
  );
  let sameKeys = _.intersection(rootKeys, newKeys);
  if (sameKeys.length > 0) {
    throw new Error('Duplicate keys found in multiple configs. Expected none. Found: ' + JSON.stringify(sameKeys));
  }

  // Add on the new properties
  _.extend(rootContainer.queries, newContainer.queries);
  _.extend(rootContainer.mutations, newContainer.mutations);
});

// Define our root query and mutation object types
export const RootQueryObjectType = new GraphQLObjectType({
  name: 'RootQueryObjectType',
  description: 'Root for all queries',
  fields: rootContainer.queries
});
export const RootMutationObjectType = new GraphQLObjectType({
  name: 'RootMutationObjectType',
  description: 'Root for all mutations',
  fields: rootContainer.mutations
});
