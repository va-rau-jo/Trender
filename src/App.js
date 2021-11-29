import queryString from 'query-string';
import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Manager from './pages/Manager';
import MonthlyPlaylists from './pages/MonthyPlaylists';
import SpotifyPlaylistManager from './utils/Spotify/SpotifyPlaylistManager';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const accessToken = queryString.parse(window.location.search).access_token;
    this.state = {accessToken: accessToken};

    if (accessToken) {      
      SpotifyPlaylistManager.setAccessToken(accessToken);
    }
  }

  render() {
    return (
      <>
        <Header />
        <BrowserRouter >
          {/* A <Switch> looks through all its children <Route> elements and
          renders the first one whose path matches the current URL. Use a
          <Switch> any time you have multiple routes, but you want only one of
            them to render at a time */}
          <Routes>
            <Route exact path='/'  element={<Home />} />
            <Route path='/login'   element={<Login />} />
            <Route path='/monthly' element={<MonthlyPlaylists />} />
            <Route path='/manager' element={<Manager />} />
            <Route>
              {/* TODO: make page not found page better */}
              Page Not Found
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;