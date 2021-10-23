import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import LoadingIndicator from '../components/LoadingIndicator';
import ProgressIndicator from '../components/ProgressIndicator';
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

class MonthlyPlaylists extends Component {
  constructor(props) {
    super(props);

    if (SpotifyAPIManager.getAccessToken()) {
      SpotifyAPIManager.getUserData(props.firebaseController);
      SpotifyAPIManager.getPlaylistData(true, true).then(data => {
        this.groupPlaylistsByYear(data['playlists'], data['songs']);
        this.clearLoadingInterval();
      }).catch(error => {
        console.log(error);
        this.setState({ error });
      });
    }
  }

  componentDidMount = () => {
    this.setState({
      loadingInterval: setInterval(() => {
        this.setState({
          loadingProgress: SpotifyAPIManager.getLoadingProgress(),
          loadingTotal: SpotifyAPIManager.getLoadingTotal()
        });
      }, 1000)
    });
  }

  clearLoadingInterval = () => {
    clearInterval(this.state.loadingInterval);
    this.setState({
      loadingProgress: null,
      loadingTotal: null,
    });
  }

  compareIsDiff(i, j) {
    return this.state.selectedPlaylist &&
      this.getPlaylistFromStateVar(i, j) !== this.state.selectedPlaylist;
  }

  /**
   * Groups playlists by the year they were created. Each entry in the returned
   * array is in the form ['year', [playlist1, songs1], [playlist2, songs2]...]
   */
  groupPlaylistsByYear(playlists, songs) {
    let years = [];
    let currentYear = null;
    playlists.forEach((playlist, i) => {
      if (songs[i].length > 0 ) {
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
    }, () => {
      // Reset the playlist to compare to if they are the same playlist.
      if (!this.compareIsDiff(yearIndex, monthIndex)) {
        this.setState({
          comparePlaylist: null,
          compareSongs: null,
        });
      }
    });
  }

  /**
   * Onclick for the compare button on playlists that are not the current one
   * you have selected.
   *
   * @param {number} yearIndex The index of the outer array, [0] returns the playlists
   * from the latest year.
   * @param {number} monthIndex The index of the inner array, [0] returns the
   * playlist from the latest month.
   * @param {Event} event The onclick event, needed to prevent the click from
   * registering on the actual list item.
   */
  updateCompareMonth = (yearIndex, monthIndex, event) => {
    event.stopPropagation();
    this.setState({
      comparePlaylist: this.getPlaylistFromStateVar(yearIndex, monthIndex),
      compareSongs: this.getSongsFromStateVar(yearIndex, monthIndex),
    });
  }

  render() {
    const { accessToken, classes, firebaseController } = this.props;

    // Go back to Home screen to fetch the Spotify access token.
    if (this.state) {
      if (!accessToken) {
        window.location.replace('/');
      } else if (this.state.error) {
        // TODO: have a better error when fetches fail.
        return (<div> retry ? </div>);
      } else if (this.state.loadingProgress || !this.state.playlists) {
        return <ProgressIndicator progress={this.state.loadingProgress} total={this.state.loadingTotal} />;
      } else if (this.state.playlists) {
        const { playlists, selectedPlaylist } = this.state;

        const drawer = (
          <div className={classes.drawer}>
            {/* Year list contains ['year', [[playlist1, songs1]... ] */}
            {playlists.map((yearList, i) => (
              <div key={i} >
                {i !== 0 ? <Divider /> : null}

                <List>
                  <Typography variant='h6' className={classes.yearLabel}>
                    {yearList[0]}
                  </Typography>
                  {yearList[1].map((playlistGroup, j) => (
                    <ListItem onClick={() => {
                      // Selected playlist cannot be selected twice.
                      if (this.getPlaylistFromStateVar(i, j) !== selectedPlaylist) {
                        this.updateMonth(i, j);
                      }
                    }}
                      key={j}
                      className={classes.listItemMonth +
                        (this.getPlaylistFromStateVar(i, j) === selectedPlaylist ?
                          ' ' + classes.selectedItem : '')}>

                      <ListItemText primary={playlistGroup[0].name} />
                      {this.compareIsDiff(i, j) ?
                        <img className={classes.compareBtn} src='/images/compare.png' alt='compare'
                          onClick={(e) => { this.updateCompareMonth(i, j, e) }} /> : null}
                    </ListItem>
                  ))}
                </List>
              </div>
            ))}
          </div>
        );

        return (
          <div className={classes.flex}>
            {drawer}
            <div className={classes.summary}>
              <Summary
                firebaseController={firebaseController}
                comparePlaylist={this.state.comparePlaylist}
                compareSongs={this.state.compareSongs}
                playlist={this.state.selectedPlaylist}
                songs={this.state.selectedSongs} />
            </div>
          </div>
        );
      }
    }
    return <LoadingIndicator />;
  }
}

export default withStyles(styles)(MonthlyPlaylists);