const { GraphQLID, GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const { nodeDefinitions, fromGlobalId, globalIdField, mutationWithClientMutationId } = require('graphql-relay');

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    
    switch (type) {
      case 'User':
        return db.users.find(user => String(user.id) === id).map(u => new User(u));
      default:
        return null;
    }
  },
  (obj) => {
    return User;
  }
);

const db = {
  users: [
    { id: 1, username: 'vslinko', email: 'vslinko@yahoo.com' }
  ],
  posts: [
    { id: 1, title: 'q' }
  ]
};

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
        return db.posts;
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
        return db.users;
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
