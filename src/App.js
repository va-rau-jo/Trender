import React, { Component } from 'react';
import queryString from 'query-string';
import Sidebar from './components/Sidebar'
import Summary from './components/Summary'
import Toolbar from './components/Toolbar'
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
    flex: '0 0 15%'
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

  filterPlaylistsByMonth(playlists) {
    let regex = /^January|February|March|April|May|June|July|August|September|October|November|December$/;
    for(let i = playlists.length - 1; i >= 0; i--) {
      if(!regex.test(playlists[i].name)) {
        playlists.splice(i, 1);
      }
    }
  }

  getPlaylistData() {
    let accessToken = this.state.accessToken;
    fetch(base_url + 'me/playlists', {
      headers: {'Authorization' : 'Bearer ' + accessToken}
    })
    .then(res => {
      this.setState({ accessError: !res.ok });
      return res.json();
    })
    .then(playlistData => {     
      let playlistItems = playlistData.items;
      if (playlistItems) {
        this.filterPlaylistsByMonth(playlistItems);
        // Get track data for each playlist object
        let trackDataPromises = playlistItems.map(playlist => {
          // Fetches more trackData from playlist's details link
          let responsePromise = fetch(playlist.tracks.href, {
            headers: {'Authorization': 'Bearer ' + accessToken}
          });
          let trackDataPromise = responsePromise.then(response => response.json())
          return trackDataPromise;
        });
        let songs = [];
        // Only map relevant properties to songs array and save
        // song array in state
        Promise.all(trackDataPromises).then(trackDatas => {
          //console.log(trackDatas);
          trackDatas.forEach((trackData, i) => {
            songs[i] = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                added_at: trackData.added_at,
                artists: trackData.artists,
                duration: trackData.duration_ms / 1000,
                explicit: trackData.explicit,
                name: trackData.name,
              }));
          });
          //console.log("appjs set song state")
          this.setState({
            playlists: playlistItems,
            songs
          });
          //console.log(songs)
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
    const { accessToken, accessError, playlists } = this.state;
    const { classes } = this.props;
    //console.log("appjs render")
    //console.log(this.state)
    if ((this.state && !accessToken) || accessError) {
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
