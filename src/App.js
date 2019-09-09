import React, { Component } from 'react';
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
    flex: '0 0 20%'
  },
  summary : {
    flex: '1'
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    let authToken = queryString.parse(window.location.search).access_token;
    this.state = {
      accessToken: authToken,
      selected: -1
    };
    this.updateSummary = this.updateSummary.bind(this);
    if (authToken)
      this.getPlaylistData(authToken);
  }

  getPlaylistData() {
    let accessToken = this.state.accessToken;
    fetch(base_url + 'me/playlists', {
      headers: {'Authorization' : 'Bearer ' + accessToken}
    })
      .then(res => res.json())
      .then(playlistData => {
        let playListItems = playlistData.items;
        if (playListItems) {
          // Filter by month names
          let regex = /^January|February|March|April|May|June|July|August|September|October|November|December$/;
          for(let i = playListItems.length - 1; i >= 0; i--) {
            if(!regex.test(playListItems[i].name)) {
              playListItems.splice(i, 1);
            }
          }
          // Save playlists
          this.setState({
            playlists: playListItems
          });

          // Save song data to state
          let trackDataPromises = playListItems.map(playlist => {
            // Fetches more trackData from playlist's details link
            let responsePromise = fetch(playlist.tracks.href, {
              headers: {'Authorization': 'Bearer ' + accessToken}
            });
            let trackDataPromise = responsePromise.then(response => response.json())
            return trackDataPromise;
          });
          let allTracksDataPromises = Promise.all(trackDataPromises);
          allTracksDataPromises.then(trackDatas => {
            this.setState({
              songs: trackDatas
            });
          });
        }
      });
  }

  updateSummary(index) {
    // console.log("appjs" + index)
    // console.log("appjs state: " + this.state.songs)
    this.setState({
      selected: index
    });
  }

  render() {
    const { accessToken, playlists } = this.state;
    const { classes } = this.props;
    if (this.state && !accessToken) {
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
            <div className={classes.sidebar}>
              <Sidebar updateSummary={this.updateSummary} playlists={this.state.playlists} />
            </div>
            <div className={classes.summary}>
              <Summary songs={this.state.songs} selected={this.state.selected} playlists={this.state.playlists}/>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(App);
