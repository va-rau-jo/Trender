import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LoadingIndicator from '../components/LoadingIndicator';
import SpotifyAPIManager from '../utils/SpotifyAPIManager';
import Summary from '../components/Summary/Summary';

/**
 * This is preferred over using an external css file for styling because React
 * components that are imported have their own classes that override CSS classes
 * in external files. The classes defined here will override the CSS classes
 * that the React components provide. The CSS will actually follow this!
 */
const styles = () => ({
  // compare button on list items
  compareBtn: {
    height: '20px',
    width: '20px',
  },
  // The drawer object
  drawer: {
    height: '100%',
    overflowY: 'scroll',
    width: '12%',
  },
  // Max width of drawer container
  drawerContainer: {
    width: '160px',
  },
  // Parent div to display the sidebar and summary
  flex: {
    display: 'flex',
    height: '100%',
  },
  // List item (month name) in the drawer.
  listItemMonth: {
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 150ms',
    '&:hover': {
      background: '#dedede'
    },
  },
  selectedItem: {
    backgroundColor: '#c4ecc7',
    '&:hover': {
      background: '#c4ecc7'
    },
  },
  // Summary component's area should expand to fit the remaining area.
  summary: {
    backgroundColor: '#F7F6FD',
    margin: '0 auto',
    textAlign: 'center',
    width: '87%',
  },
  // Label for each year in the drawer.
  yearLabel: {
    fontWeight: 'bold',
    marginLeft: '10px',
  },
});

class Combiner extends Component {
  constructor(props) {
    super(props);

    if (SpotifyAPIManager.getAccessToken()) {
      SpotifyAPIManager.getPlaylistData().then(data => {
        this.setState({ playlists: data['playlists'], songs: data['songs'] });
      });
    }
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
    return this.state.playlists[yearIndex][1][monthIndex][1];
  }

  render() {
    const { accessToken, classes, firebaseController } = this.props;

    // Go back to Home screen to fetch the Spotify access token.
    if (this.state && !accessToken) {
      window.location.replace('/');
    } else if (!this.state) {
      return <LoadingIndicator />;
    }

    const { playlists, selectedPlaylist } = this.state;

    const drawer = (
      <div className={classes.drawer}>
        {/* Year list contains ['year', [[playlist1, songs1]... ] */}
        {playlists.map((playlist) => (
          <div key={playlist.id}>
            {playlist.name}
          </div>
        ))}
      </div>
    );

    return (
      <div className={classes.flex}>
        {drawer}
      </div>
    );
  }
}

export default withStyles(styles)(Combiner);