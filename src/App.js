import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import Sidebar from './components/Sidebar/Sidebar'
import Summary from './components/Summary/Summary'

const base_url = "https://api.spotify.com/v1/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      serverData: {},
      playlists: []
    };
  }

  componentDidMount() {
    let accessToken = queryString.parse(window.location.search).access_token;
    fetch(base_url + "me/playlists", {
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
          })
          let trackDataPromise = responsePromise
            .then(response => response.json())
          return trackDataPromise
        })
        let allTracksDataPromises = 
          Promise.all(trackDataPromises)
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
        return playlistsPromise })
  }

  render() {
    const { error, playlists } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!playlists){
      return <div>No Playlists</div>;
    }
    else {
      return (
        <div>
          <div>
            <Sidebar playlists={this.state.playlists} />
          </div>
          <div>
            <Summary />
          </div>
        </div>
      );
    }
  }
}

export default App;
