const React = require('react');
const Relay = require('react-relay');
const { render } = require('react-dom');
// const { Router, browserHistory, applyRouterMiddleware } = require('react-router');
// const useRelay = require('react-router-relay');

class LikePostMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { like }`;
  }
  
  getVariables() {
    return {
      postId: this.props.post.id,
      weight: this.props.weight,
    }
  }
  
  getFatQuery() {
    return Relay.QL`
      fragment on LikePayload {
        post {
          likeCount
        }
      }
    `
  }
  
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          post: this.props.post.id,
        },
      }
    ];
  }
  
  getCollisionKey() {
    return `like${this.props.post.id}`
  }
  
  getOptimisticConfigs() {
    return this.getConfigs();
  }
  
  getOptimisticResponse() {
    return {
      post: {
        id: this.props.post.id,
        likeCount: this.props.post.likeCount + this.props.weight
      }
    }
  }
}
LikePostMutation.fragments = {
  post: () => Relay.QL`
    fragment on Post {
      id
      likeCount
    }
  `
}

class PostForm extends React.Component {
  constructor() {
    super();
    this.state = {
      title: ''
    }
  }
  
  render() {
    return (
      <form onSubmit={(e) => this.save(e)}>
        <input
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
        />
        <button type="submit">Publish</button>
      </form>
    );
  }
  
  save(e) {
    e.preventDefault();
    console.log(this.state);
  }
}

class Post extends React.Component {
  render() {
    return (
      <div>
        <div>{this.props.post.title}</div>
        <div>Likes: {this.props.post.likeCount}</div>
        <button onClick={() => this.like()}>Like</button>
        <button onClick={() => this.dislike()}>Dislike</button>
        <hr />
      </div>
    );
  }
  
  like() {
    this.props.relay.commitUpdate(
      new LikePostMutation({
        post: this.props.post,
        weight: 1,
      })
    );
  }
  
  dislike() {
    this.props.relay.commitUpdate(
      new LikePostMutation({
        post: this.props.post,
        weight: -1
      })
    );
  }
}


const PostContainer = Relay.createContainer(Post, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        id
        title
        likeCount
        ${LikePostMutation.getFragment('post')}
      }
    `
  }
});

class App extends React.Component {
  render() {
    console.log(this.props.relay);
    const showNextButton =
      this.props.viewer.posts.pageInfo.hasNextPage;

    return (
      <div>
        {this.props.viewer.posts.edges.map(edge => (
          <PostContainer
            key={edge.cursor}
            post={edge.node}
          />
        ))}
        {showNextButton &&
          <button onClick={() => this.loadNextPosts()}>Next Posts</button>
        }
        <PostForm />
      </div>
    );
  }
  
  loadNextPosts() {
    this.props.relay.setVariables({
      first: this.props.relay.variables.first + 2,
    })
  }
}

const AppContainer = Relay.createContainer(App, {
  initialVariables: {
    first: 2,
  },
  
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        posts(first: $first) { # PostConnect
          pageInfo {
            hasNextPage
          }
          edges { # PostEdge
            cursor
            node { # Post
              ${PostContainer.getFragment('post')}
            }
          }
        }
        users {
          id
          email
        }
      }
    `
  }
});

// const routes = [“
//   {
//     path: '/',
//     component: AppContainer,
//     queries: {
//       viewer: () => Relay.QL`query { viewer }`
//     }
//   },
// ];

// Relay.injectNetworkLayer(
//   new Relay.DefaultNetworkLayer('/graphql')
// );

// Relay.injectTaskScheduler((task) => {
//   setTimeout(task, 0);
// });

render(
  <Relay.Renderer
    Container={AppContainer}
    queryConfig={{
      name: 'ViewerRoute',
      queries: {
        viewer: () => Relay.QL`query { viewer }`,
      },
      params: {},
    }}
    environment={Relay.Store}
    render={({ done, error, props, retry, stale }) => {
      if (error) {
        return <span>{error.message}</span>;
      } else if (props) {
        return <AppContainer {...props} />;
      } else {
        return <span>Loading...</span>;
      }
    }}
  />,
  document.querySelector('#app')
);

// render(
//   <Router
//     history={browserHistory}
//     routes={routes}
//     render={applyRouterMiddleware(useRelay)}
//     environment={Relay.Store}
//   />,
//   document.querySelector('#app')
// );
