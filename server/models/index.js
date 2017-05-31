// Load in our dependencies
import {GraphQLSchema} from 'graphql';

import {RootQueryObjectType, RootMutationObjectType} from './root';

// Initialize our schema and export it
export const schema = new GraphQLSchema({
  query: RootQueryObjectType,
  mutation: RootMutationObjectType
});
