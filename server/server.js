// Refactoring and implementing Apollo
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require("apollo-server-express")
const routes = require('./routes');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require("../schemas");


const app = express();
const PORT = process.env.PORT || 3001;
// added
const server = ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
    console.log(`Use GraphQl at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
