const express = require('express');
const graphqlMiddleware = require('express-graphql');
const htmlTemplate = require('./htmlTemplate');

const schema = require('./schema');

const app = express();

app.use('/graphql', graphqlMiddleware((req) => {
  return {
    schema,
    graphiql: true,
  };
}));

app.get('*', (req, res) => {
  res.send(htmlTemplate());
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Listening 0.0.0.0:3001');
});
