import React, { Component, Route } from 'react';
import queryString from 'query-string';
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import Summary from './components/Summary'
import { Typography, withStyles } from '@material-ui/core';

const base_url = "https://api.spotify.com/v1/";

const styles = () => ({
  page: {
    alignitems: 'stretch',
    display: 'flex',
    flexdirection: 'row',
    width: '100%'
  },
  sidebar: {
    flex: '0 0 50%'
  },
  summary : {
    flex: '1'
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    let accessToken = queryString.parse(window.location.search).access_token;
    this.state = { authToken: accessToken };
    if (accessToken)
      this.getPlaylistData(accessToken);
  }

  getPlaylistData(accessToken) {
    fetch(base_url + 'me/playlists', {
      headers: {'Authorization' : 'Bearer ' + accessToken}
    })
      .then(res => res.json())
      .then(playlistData => {
        let items = playlistData.items;
        this.setState({
          playlists: items
        });

        let trackDataPromises = items.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: {'Authorization': 'Bearer ' + accessToken}
          });
          let trackDataPromise = responsePromise.then(response => response.json())
          return trackDataPromise;
        });
        let allTracksDataPromises = Promise.all(trackDataPromises);
        let playlistsPromise = allTracksDataPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            items[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }))
          })
          return items
        });
        return playlistsPromise });
  }

  render() {
    const { authToken, playlists } = this.state;
    const { classes } = this.props;
    if (this.state && !authToken) {
        window.location.replace('http://localhost:8888')
      return null;
    } else if (!playlists){ 
      return (
        <div>
          <Typography style={{color: "white", textAlign: "center"}}>No Playlists Found</Typography>
        </div>
      );
    } else {
      return (
        <div>
          <Toolbar/>
          <div className={classes.page}>
            <div className={classes.sidebar} >
              <Sidebar playlists={this.state.playlists} />
            </div>
            <div className={classes.summary}>
              <Summary accessToken={this.state.authToken} playlists={this.state.playlists}/>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(App);
