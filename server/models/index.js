// Load in our dependencies
import {GraphQLSchema} from 'graphql';

import RootObjectType from './root';

// Initialize our schema and export it
export const schema = new GraphQLSchema({
  query: RootObjectType
});
