import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LoadingIndicator from '../components/LoadingIndicator';
import SpotifyAPIManager from '../utils/SpotifyAPIManager';
import Summary from "../components/Summary/Summary";

/**
 * This is preferred over using an external css file for styling because React
 * components that are imported have their own classes that override CSS classes
 * in external files. The classes defined here will override the CSS classes
 * that the React components provide. The CSS will actually follow this!
 */
const styles = () => ({
  drawer: {
    height: '100%',
    overflowY: 'auto',
    position: 'fixed',
    top: '0',
    width: '160px',
    zIndex: '1200',
  },
  drawerContainer: {
    width: '160px',
  },
  flex: {
    display: 'flex',
  },
  listItemMonth: {
    cursor: "pointer",
    textAlign: "center",
    transition: "background-color 150ms",
    "&:hover": {
      background: "#dedede"
    },
  },
  summary: {
    flexGrow: 1,
  },
  yearLabel: {
    marginLeft: "10px",
  },
});

class MonthlyPlaylists extends Component {
  constructor(props) {
    super(props);

    if (SpotifyAPIManager.getAccessToken()) {
      SpotifyAPIManager.getUserData(props.firebaseController);
      SpotifyAPIManager.getPlaylistData().then(data => {
        this.groupPlaylistsByYear(data["playlists"], data["songs"]);
      });
    }
  }

  /**
   * Groups playlists by the year they were created. Each entry in the returned
   * array is in the form ["year", [playlist1, songs1], [playlist2, songs2]...]
   */
  groupPlaylistsByYear(playlists, songs) {
    let years = [];
    let currentYear = null;
    playlists.forEach((playlist, i) => {
      const added = songs[i][Math.floor(songs[i].length / 2)].added_at;
      const year = new Date(added).getFullYear();
      // Add the first playlist to its own list or add a later year's playlist
      // to a new list.
      if (years.length === 0 || year !== currentYear) {
        years.push([year, [[playlist, songs[i]]]]);
        currentYear = year;
      } else {
        years[years.length - 1][1].push([playlist, songs[i]]);
      }
    });

    this.setState({ playlists: years });
  }

  /**
   * Extracts a playlist from the given year and month from the playlists state
   * variable.
   *
   * @param {number} yearIndex The index of the outer array, [0] returns the playlists
   * from the latest year.
   * @param {number} monthIndex The index of the inner array, [0] returns the
   * playlist from the latest month.
   * @returns {JSON} A playlist object.
   */
  getPlaylistFromStateVar(yearIndex, monthIndex) {
    return this.state.playlists[yearIndex][1][monthIndex][0];
  }

  /**
   * Extracts the lists of songs from the given year and month from the
   * playlists state variable.
   *
   * @param {number} yearIndex The index of the outer array, [0] returns the playlists
   * from the latest year.
   * @param {number} monthIndex The index of the inner array, [0] returns the
   * playlist from the latest month.
   * @returns {Array} An array of song objects.
   */
  getSongsFromStateVar(yearIndex, monthIndex) {
    console.log(this.state.playlists)
    return this.state.playlists[yearIndex][1][monthIndex][1];
  }

  /**
   * Onclick for the list of monthly playlists. Should open a summary of that
   * playlist.
   *
   * @param {number} yearIndex The index of the outer array, [0] returns the playlists
   * from the latest year.
   * @param {number} monthIndex The index of the inner array, [0] returns the
   * playlist from the latest month.
   */
  updateMonth = (yearIndex, monthIndex) => {
    this.setState({
      selectedPlaylist: this.getPlaylistFromStateVar(yearIndex, monthIndex),
      selectedSongs: this.getSongsFromStateVar(yearIndex, monthIndex),
    });
  }

  render() {
    const { accessToken, classes, firebaseController } = this.props;

    // Go back to Home screen to fetch the Spotify access token.
    if (this.state && !accessToken) {
      window.location.replace('/');
    } else if (!this.state) {
      return <LoadingIndicator />;
    }

    const drawer = (
      <div>
        {/* Year list contains ["year", [[playlist1, songs1]... ] */}
        {this.state.playlists.map((yearList, i) => (
          <div key={i}>
            {i !== 0 ? <Divider /> : null}

            <List>
              <Typography variant="h6" className={classes.yearLabel}>
                {yearList[0]}
              </Typography>
              {yearList[1].map((playlistGroup, j) => (
                <ListItem onClick={() => {this.updateMonth(i, j)}} key={j}
                  className={classes.listItemMonth}>
                  <ListItemText primary={playlistGroup[0].name} />
                </ListItem>
              ))}
            </List>
          </div>
        ))}
      </div>
    );

    return (
      <div className={classes.flex}>
        <div className={classes.drawerContainer}>
          <div className={classes.drawer}>
            <Paper elevation={1} variant="outlined">
              {drawer}
            </Paper>
          </div>
        </div>
        <div className={classes.summary}>
          <Summary
            firebaseController={firebaseController}
            playlist={this.state.selectedPlaylist}
            songs={this.state.selectedSongs} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MonthlyPlaylists);