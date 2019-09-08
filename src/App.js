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
        let items = playlistData.items;
        this.setState({
          playlists: items
        });
        console.log(items[0].name);

        let trackDataPromises = items.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: {'Authorization': 'Bearer ' + accessToken}
          });
          let trackDataPromise = responsePromise.then(response => response.json())
          return trackDataPromise;
        });
        let allTracksDataPromises = Promise.all(trackDataPromises);
        allTracksDataPromises.then(trackDatas => {
          console.log(trackDatas[0].items)
          this.setState({
            songs: trackDatas
          });
        });
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
