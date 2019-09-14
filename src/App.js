import React, { Component } from "react";
import queryString from "query-string";
import firebase from "firebase";
import { Typography, withStyles } from "@material-ui/core";
import Sidebar from "./components/Sidebar";
import Summary from "./components/Summary";
import Toolbar from "./components/Toolbar";
import firebaseConfig from "./config";

const base_url = "https://api.spotify.com/v1/";
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const styles = () => ({
  page: {
    alignitems: "stretch",
    display: "flex",
    flexdirection: "row",
    width: "100%"
  },
  sidebar: {
    flex: "0 0 15%"
  },
  summary: {
    flex: "1"
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
    if (authToken) {
      this.getUserData();
      this.getPlaylistData(authToken);
    }
  }

  /**
   * Given an array of playlists, it filters out any that do not
   * contain a monthly playlist
   * @param {Array of playlists} playlists
   */
  filterPlaylistsByMonth(playlists) {
    let regex = /^January|February|March|April|May|June|July|August|September|October|November|December$/;
    for (let i = playlists.length - 1; i >= 0; i--) {
      if (!regex.test(playlists[i].name)) {
        playlists.splice(i, 1);
      }
    }
  }

  /**
   * Get playlist data from Spotify API and call API again for each playlist
   * to get the song data
   */
  getPlaylistData() {
    let accessToken = this.state.accessToken;
    fetch(base_url + "me/playlists", {
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(res => {
        this.setState({ accessError: !res.ok });
        return res.json();
      })
      .then(playlistData => {
        let playlists = playlistData.items;
        if (playlists) {
          this.filterPlaylistsByMonth(playlists);
          // Get track data for each playlist object
          let trackDataPromises = playlists.map(playlist => {
            // Fetches more trackData from playlist's details link
            let responsePromise = fetch(playlist.tracks.href, {
              headers: { Authorization: "Bearer " + accessToken }
            });
            let trackDataPromise = responsePromise.then(response =>
              response.json()
            );
            return trackDataPromise;
          });
          let songs = this.getSongData(trackDataPromises);
          this.setState({ playlists, songs });
        }
      });
  }

  /**
   * Get rankings for playlist songs from firebase.
   */
  getRankingData() {
    db.collection("rankings")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
        });
      });
  }

  /**
   * Get song data using promise from the playlist's link to its
   * details, returns an array of songs
   */
  getSongData(trackDataPromises) {
    // Only map relevant properties to songs array
    let songs = [];
    Promise.all(trackDataPromises).then(trackDatas => {
      trackDatas.forEach((trackData, i) => {
        songs[i] = trackData.items
          .map(item => item.track)
          .map(trackData => ({
            added_at: trackData.added_at,
            artists: trackData.artists,
            duration: trackData.duration_ms / 1000,
            explicit: trackData.explicit,
            name: trackData.name
          }));
      });
    });
    return songs;
  }

  /**
   * Gets the current user's id from Spotify API, and compares it to ids
   * on Firebase, adding an entry if it does not already exist
   */
  getUserData() {
    fetch(base_url + "me", {
      headers: { Authorization: "Bearer " + this.state.accessToken }
    })
      .then(res => {
        this.setState({ accessError: !res.ok });
        return res.json();
      })
      .then(data => {
        db.collection("users")
          .where("userId", "==", data.id)
          .get()
          .then(querySnapshot => {
            let docs = querySnapshot.docs;
            if (docs.length > 0 && docs[0] != null) {
              let userId = docs[0].data().userId;
              this.setState({ userId });
            } else {
              db.collection("users").add({
                userId: data.id,
                name: data.display_name,
                email: data.email
              });
            }
            this.getRankingData();
          });
      });
  }

  /**
   * Updates the selected playlist state variable, forces rerender
   * @param {Index of selected playlist} index
   */
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
      window.location.replace("http://localhost:8888");
      return null;
    } else if (!playlists) {
      return (
        <div>
          <Typography style={{ color: "white", textAlign: "center" }}>
            No Playlists Found
          </Typography>
        </div>
      );
    } else {
      return (
        <div>
          <Toolbar />
          <div className={classes.page}>
            <div className={classes.sidebar}>
              <Sidebar
                updateSummary={this.updateSummary}
                playlists={this.state.playlists}
              />
            </div>
            <div className={classes.summary}>
              <Summary
                playlists={this.state.playlists}
                selected={this.state.selected}
                songs={this.state.songs}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(App);
