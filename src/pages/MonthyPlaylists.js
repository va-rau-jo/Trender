import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

import LoadingIndicator from '../components/LoadingIndicator';
import ProgressIndicator from '../components/ProgressIndicator';
import SpotifyAPIManager from '../utils/Spotify/SpotifyAPIManager';
import Summary from '../components/MonthlyPlaylists/Summary';
import { SHARED_STYLES } from '../utils/sharedStyles';
import SongInfoDialog from '../components/MonthlyPlaylists/SongInfoDialog';

/**
 * This is preferred over using an external css file for styling because React
 * components that are imported have their own classes that override CSS classes
 * in external files. The classes defined here will override the CSS classes
 * that the React components provide. The CSS will actually follow this!
 */
const styles = () => ({
  // compare button on list items
  compareBtn: {
    cursor: 'pointer',
    height: '30%',
    padding: '0.25vw',
    position: 'absolute',
    right: '2vh',
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'background-color 150ms',
    '&:hover': {
      backgroundColor: '#dedede'
    },
  },
  compareBtnSelected: {
    '&:hover': {
      backgroundColor: '#efefef'
    },
  },
  // The drawer object
  drawer: {
    backgroundColor: 'white',
    height: '100%',
    overflowY: 'scroll',
    width: '25vh',
  },
  // Parent div to display the sidebar and summary
  flex: {
    display: 'flex',
    height: SHARED_STYLES.PAGE_HEIGHT,
  },
  monthList: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  // List item (month name) in the drawer.
  monthListItem: {
    display: 'flex',
    justifyContent: 'center',
    listStyle: 'none',
    padding: '0.8vh',
    position: 'relative',
    width: '-webkit-fill-available',
  },
  monthName: {
    fontSize: SHARED_STYLES.FONT_SIZE_LARGE,
  },
  selectedPrimaryItem: {
    backgroundColor: '#759fff',
  },
  selectedSecondaryItem: {
    backgroundColor: '#fd7a7a',
  },
  // Summary component's area should expand to fit the remaining area.
  summary: {
    margin: '0 auto',
    textAlign: 'center',
    width: 'calc(100vw - 25vh)',
  },
  yearGroup: {
    margin: '1vh 0',
    padding: '0',
  },
  // Label for each year in the drawer.
  yearLabel: {
    fontSize: SHARED_STYLES.FONT_SIZE_HEADER,
    fontWeight: 'bold',
    marginLeft: '1vh',
  },
});

class MonthlyPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {songDialogOpen: false};

    if (SpotifyAPIManager.getAccessToken()) {
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
    return this.state.playlist1 &&
      this.getPlaylistFromStateVar(i, j) !== this.state.playlist1;
  }

  /**
   * Groups playlists by the year they were created. Each entry in the returned
   * array is in the form ['year', [playlist1, songs1], [playlist2, songs2]...]
   */
  groupPlaylistsByYear(playlists, songs) {
    let years = [];
    let currentYear = null;
    if (!songs) {
      currentYear = new Date().getFullYear();
      years.push([currentYear, []]);
      playlists.forEach(playlist => { years[0][1].push([playlist, []]) })
    } else {
      playlists.forEach((playlist, i) => {
        if (songs[i].length > 0) {
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
    }
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
   * @param {number} monthIndex The index of the inner array, [0] returns the100
   * playlist from the latest month.
   * @returns {Array} An array of song objects.
   */
  getSongsFromStateVar(yearIndex, monthIndex) {
    return this.state.playlists[yearIndex][1][monthIndex][1];
  }

  openSongInfoDialog = (song) => {
    this.setState({ songDialogOpen: true, songDialogSong: song });
  }

  /**
   * Onclick handler for the list of monthly playlists. Should set the playlist to either the
   * primary or secondary playlist so that 2 playlists can be compared. Calling update when already
   * selected should unselect the playlist.
   *
   * @param {number} yearIndex The index of the outer array, [0] returns the playlists
   * from the latest year.
   * @param {number} monthIndex The index of the inner array, [0] returns the
   * playlist from the latest month.
   */
  updateMonth = (yearIndex, monthIndex) => {
    const { playlist1, playlist2 } = this.state;
    const playlist = this.getPlaylistFromStateVar(yearIndex, monthIndex);

    const isPrimary = playlist1 && (playlist.id === this.state.playlist1.id);
    const isSecondary = playlist2 && (playlist.id === this.state.playlist2.id);

    if (isPrimary) { // Remove selected playlist and set secondary to primary
      this.setState({
        playlist1: playlist2,
        playlist2: undefined,
        songs1: this.state.songs2,
        songs2: undefined
      });
    } else if (isSecondary) { // Remove selected playlist from secondary
      this.setState({ playlist2: undefined, songs2: undefined });
    } else if (!playlist1) { // Add selected to primary
      this.setState({ playlist1: playlist,songs1: this.getSongsFromStateVar(yearIndex, monthIndex) });
    } else { // Add selected to secondary
      this.setState({ playlist2: playlist, songs2: this.getSongsFromStateVar(yearIndex, monthIndex) });
    }
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
      playlist2: this.getPlaylistFromStateVar(yearIndex, monthIndex),
      songs2: this.getSongsFromStateVar(yearIndex, monthIndex),
    });
  }

  render() {
    const { classes } = this.props;
    const accessToken = SpotifyAPIManager.getAccessToken();

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
        const { playlists, playlist1, playlist2, songDialogOpen, songDialogSong } = this.state;
        const playlist1Id = playlist1 ? playlist1.id : undefined;
        const playlist2Id = playlist2 ? playlist2.id : undefined;

        return (
          <div className={classes.flex}>
            <div className={classes.drawer}>
              {/* Year list contains ['year', [[playlist1, songs1]... ] */}
              {playlists.map((yearList, i) => (
                <div key={i}>
                  {i !== 0 ? <Divider /> : null}
                  <ul className={classes.yearGroup}>
                    <Typography variant='h6' className={classes.yearLabel}>
                      {yearList[0]}
                    </Typography>
                    <div className={classes.monthList}>
                      {yearList[1].map((playlistGroup, j) => {
                        const selectedPlaylist1 = playlistGroup[0].id === playlist1Id;
                        const selectedPlaylist2 = playlistGroup[0].id === playlist2Id;
                        const selected = selectedPlaylist1 || selectedPlaylist2;

                        const liClass = [classes.monthListItem,
                          (selectedPlaylist1 ? classes.selectedPrimaryItem :
                            selectedPlaylist2 ? classes.selectedSecondaryItem : null)].join(' ');

                        const imagePath = selected ? '/images/subtract.png' : '/images/plus.png';
                        const btnClass = !selected ? classes.compareBtn :
                          [classes.compareBtn, classes.compareBtnSelected].join(' ');

                        return (
                          <li key={j} className={liClass}>
                            <Typography className={classes.monthName} variant='body1'>
                              {playlistGroup[0].name}
                            </Typography>
                            {!selected && playlist1 && playlist2 ? null :
                              <img className={btnClass} src={imagePath} alt='compare'
                                onClick={() => { this.updateMonth(i, j) }} />
                            }
                          </li>
                        );
                      })}
                    </div>
                  </ul>
                </div>
              ))}
            </div>
            <div className={classes.summary}>
              <SongInfoDialog isOpen={songDialogOpen} playlists={playlists} song={songDialogSong} spotifyPlayer={this.state.spotifyPlayer}
                onClose={() => {this.setState({songDialogOpen: false})}} />
              <Summary
                openSongInfoDialog={this.openSongInfoDialog}
                playlist1={this.state.playlist1}
                songs1={this.state.songs1}
                songs2={this.state.songs2} />
            </div>
          </div>
        );
      }
    }
    return <LoadingIndicator />;
  }
}

export default withStyles(styles)(MonthlyPlaylists);