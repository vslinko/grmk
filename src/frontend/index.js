const React = require('react');
const Relay = require('react-relay');
const { render } = require('react-dom');
// const { Router, browserHistory, applyRouterMiddleware } = require('react-router');
// const useRelay = require('react-router-relay');

class Post extends React.Component {
  render() {
    return (
      <div>
        <div>{this.props.post.title}</div>
      </div>
    );
  }
}

const PostContainer = Relay.createContainer(Post, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        title
      }
    `
  }
});

class App extends React.Component {
  render() {
    console.log(this.props.viewer.posts);
    
    return (
      <div>
        {this.props.viewer.posts.edges.map(edge => (
          <PostContainer
            key={edge.cursor}
            post={edge.node}
          />
        ))}
      </div>
    );
  }
}

const AppContainer = Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        posts(first: 2) {
          edges {
            cursor
            node {
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
