
import firebase from 'firebase/app';
import firebaseConfig from './config';
import 'firebase/firestore';
import queryString from 'query-string';
import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import FirebaseController from './utils/FirebaseController';
import Manager from './pages/Manager';
import Home from './pages/Home';
import LoadingIndicator from './components/LoadingIndicator';
import MonthlyPlaylists from './pages/MonthyPlaylists';
import SpotifyAPIManager from './utils/SpotifyAPIManager';

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
      <>
        <BrowserRouter>
          {/* A <Switch> looks through all its children <Route> elements and
          renders the first one whose path matches the current URL. Use a
          <Switch> any time you have multiple routes, but you want only one of
            them to render at a time */}
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/monthly'>
              <MonthlyPlaylists firebaseController={firebaseController} />
            </Route>
            <Route path='/manager'>
              <Manager />
            </Route>
            <Route>
              {/* TODO: make page not found page better */}
              Page Not Found
            </Route>
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}

export default App;