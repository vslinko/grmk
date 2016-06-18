const { GraphQLInt, GraphQLID, GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const { connectionDefinitions, connectionArgs, connectionFromArray, nodeDefinitions, fromGlobalId, globalIdField, mutationWithClientMutationId } = require('graphql-relay');

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
    likeCount: {
      type: GraphQLInt,
      resolve: (post) => {
        return posts.getPostLikes(post.id)
          .reduce((likeCount, like) => {
            return likeCount + like.weight;
          }, 0);
      }
    }
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

const {connectionType: PostConnection} =
  connectionDefinitions({
    nodeType: Post
  });

const Viewer = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    posts: {
      type: PostConnection,
      args: connectionArgs,
      resolve: (viewer, args) => {
        return connectionFromArray(
          posts.getPosts(),
          args
        );
      },
    },

    users: {
      type: new GraphQLList(User),
      resolve: () => {
        return users.getUsers();
      },
    },

    post: {
      type: Post,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (viewer, args) => {
        // fromGlobalId('BASE64') => {type: 'Post', id: '1'}

        return posts.getPostById(Number(fromGlobalId(args.id).id));
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

const like = mutationWithClientMutationId({
  name: 'Like',
  inputFields: {
    postId: {
      type: GraphQLID,
    },
    weight: {
      type: GraphQLInt,
    },
  },
  outputFields: {
    post: {
      type: Post
    }
  },
  mutateAndGetPayload: (input) => {
    const id =  Number(fromGlobalId(input.postId).id);
    
    if (input.weight > 0) {
      posts.like(id);
    } else {
      posts.dislike(id);
    }

    return {
      post: posts.getPostById(id),
    }
  }
})

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    like
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
