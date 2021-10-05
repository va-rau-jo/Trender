import firebase from 'firebase';
import firebaseConfig from './config';
import FirebaseController from './utils/FirebaseController';
import queryString from 'query-string';

import Manager from './pages/Manager';
import Deleter from './pages/Deleter';
import Home from './pages/Home';
import LoadingIndicator from './components/LoadingIndicator';
import MonthlyPlaylists from './pages/MonthyPlaylists';
import React, { Component } from 'react';
import SpotifyAPIManager from './utils/SpotifyAPIManager';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.css';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const firebaseController = new FirebaseController(db);

class App extends Component {
  constructor(props) {
    super(props);
    const accessToken = queryString.parse(window.location.search).access_token;
    this.state = {
      accessToken
    };

    if (accessToken) {
      SpotifyAPIManager.setAccessToken(accessToken);
    }
  }

  render() {
    const redirect = window.location.href.includes('localhost')
      ? 'http://localhost:8888/'
      : 'https://spotify-trender-server.herokuapp.com';

    if (this.state && !this.state.accessToken) {
      window.location.replace(redirect);
      return null;
    } else if (!this.state) {
      return <LoadingIndicator />;
    }

    return (
      <Router>
        {/* A <Switch> looks through all its children <Route> elements and
        renders the first one whose path matches the current URL. Use a
        <Switch> any time you have multiple routes, but you want only one of
          them to render at a time */}
        <Switch>
          <Route exact path='/'>
            <Home
              accessToken={this.state.accessToken}
              firebaseController={firebaseController} />
          </Route>
          <Route path='/monthly'>
            <MonthlyPlaylists
              accessToken={this.state.accessToken}
              firebaseController={firebaseController} />
          </Route>
          <Route path='/manager'>
            <Manager
              accessToken={this.state.accessToken} />
          </Route>
          <Route path='/deleter'>
            <Deleter
              accessToken={this.state.accessToken} />
          </Route>
          <Route>
            {/* TODO: make page not found page better */}
            Page Not Found
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;