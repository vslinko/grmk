const React = require('react');
const Relay = require('react-relay');
const { render } = require('react-dom');
// const { Router, browserHistory, applyRouterMiddleware } = require('react-router');
// const useRelay = require('react-router-relay');

class UpdateUserMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { updateUser }`;
  }
  
  getVariables() {
    return {
      id: this.props.id,
      email: this.props.email,
    };
  }
  
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user {
          email
        }
      }
    `;
  }
  
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          user: this.props.id,
        },
      }
    ];
  }
  
  getCollisionKey() {
    return `user${this.props.id}`;
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.viewer.users.map(user => (
          <div>{user.email} <button onClick={() => this.random(user.id)}>Random Email</button></div>
        ))}
      </div>
    );
  }

  random(id) {
    Relay.Store.commitUpdate(
      new UpdateUserMutation({
        id,
        email: String(Math.random()),
      })
    );
  }
}

const AppContainer = Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
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
