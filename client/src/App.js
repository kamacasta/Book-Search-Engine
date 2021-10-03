import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCaches,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

// graphql api endpoint 
const httpLink = createHttpLink({
  uri: "/graphql",
});


const authLink = setContext((_, { headers }) => {
  // token authentication
  const token = localStorage.getItem("id_token");
  // httpLink needs the return so it can read them
  return {
    headers: {
      headers,
      authorization: token? `Bearer ${token}` : "",
    },
  }
});

const client = new ApolloClient({
  // client will carry through with authLink middleware before graphql api request
  link: authLink.concat(httpLink),
  cache: new InMemoryCaches()
});

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}
import { Form } from 'react-bootstrap';

export default App;
// added additional requirements mentioned in the front end specifications