const { GraphQLObjectType } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: Viewer,
      resolve: () => ({}),
    },
  }),
});
