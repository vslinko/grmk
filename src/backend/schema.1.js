const { GraphQLID, GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const { nodeDefinitions, fromGlobalId, globalIdField, mutationWithClientMutationId } = require('graphql-relay');

class User {
  
}

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
    { title: 'q' }
  ]
};

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
  })
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
    hello: {
      type: GraphQLString,
      resolve: () => 'world',
    },
    users: {
      type: new GraphQLList(User),
      resolve: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(db.users);
          }, 1000)
        })
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

const updateUser = mutationWithClientMutationId({
  name: 'UpdateUser',
  inputFields: {
    id: {
      type: GraphQLID,
    },
    email: {
      type: GraphQLString,
    }
  },
  outputFields: {
    user: {
      type: User,
    },
  },
  mutateAndGetPayload: (args) => {
    const user = db.users[0];
    
    user.email = args.email;

    return {
      user,
    };
  },
})

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    updateUser,
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
