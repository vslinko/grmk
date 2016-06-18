const { GraphQLID, GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const { nodeDefinitions, fromGlobalId, globalIdField, mutationWithClientMutationId } = require('graphql-relay');

const users = require('./data/users');
const posts = require('./data/posts');

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    
    switch (type) {
      case 'User':
        return users.getById(id);
      default:
        return null;
    }
  },
  (obj) => {
    return User;
  }
);

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: globalIdField(),
    title: {
      type: GraphQLString,
    },
  }),
  interfaces: [nodeInterface],
});

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField(),
    username: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: (user) => {
        return posts.getUserPosts(user.id);
      }
    }
  }),
  interfaces: [nodeInterface],
});

const Viewer = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    users: {
      type: new GraphQLList(User),
      resolve: () => {
        return users.getUsers();
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: Viewer,
      resolve: () => ({}),
    },
  }),
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  // mutation: RootMutation,
});
