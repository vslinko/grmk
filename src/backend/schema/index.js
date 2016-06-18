const { GraphQLSchema } = require('graphql');

module.exports = new GraphQLSchema({
  query: RootQuery,
  // mutation: RootMutation,
});
