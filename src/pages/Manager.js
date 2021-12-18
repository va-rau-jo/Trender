import React, { Component } from 'react';
import {
  Button,
  Paper,
  Typography,
  withStyles
} from '@material-ui/core';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import LoadingIndicator from '../components/LoadingIndicator';
import ProgressIndicator from '../components/ProgressIndicator';
import PlaylistList from '../components/Manager/PlaylistList';
import { SHARED_STYLES } from '../utils/sharedStyles';
import SpotifyPlaylistManager from '../utils/Spotify/SpotifyPlaylistManager';
import Login from './Login';
import { filterDeletedPlaylists, SOFT_MONTH_MATCH } from '../utils/helpers';

/**
 * This is preferred over using an external css file for styling because React
 * components that are imported have their own classes that override CSS classes
 * in external files. The CSS will actually follow this (some require the use
 * of !important).
 */
const styles = () => ({
  actionButton: {
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    boxShadow: SHARED_STYLES.BOX_SHADOW_SCALED,
    fontSize: SHARED_STYLES.FONT_SIZE_LARGE,
    height: SHARED_STYLES.BUTTON_HEIGHT,
    minWidth: '0',
    padding: '2.5vh 2vw',
  },
  body: {
    height: '100%',
  },
  checkboxDiv: {
    display: 'flex',
    flexDirection: 'column',
    height: '15vh',
    justifyContent: 'space-evenly',
    margin: '2.5vh auto',
    textAlign: 'left',
    width: 'fit-content',
  },
  checkboxGroup: {
    alignItems: 'center',
    display: 'flex',
  },
  createdPlaylistMessage: {
    color: 'green',
    fontSize: SHARED_STYLES.FONT_SIZE_XLARGE,
    fontWeight: 'bold',
  },
  createTabPanel: {
    paddingTop: '3vh',
  },
  deletePlaylistsBtnDiv: {
    marginTop: '2vh',
  },
  deletePlaylistsFooterDiv: {
    marginTop: '4vh',
  },
  deletePlaylistsItem: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    padding: '1vh 0vw',
  },
  deletePlaylistsItemTitle: {
    display: 'inline',
    fontSize: SHARED_STYLES.FONT_SIZE_LARGE,
    fontWeight: 'bold',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  deletePlaylistsItemSongs: {
    display: 'inline',
    fontSize: SHARED_STYLES.FONT_SIZE_SMALL,
    marginLeft: '1vw',
    whiteSpace: 'nowrap',
  },
  deletePlaylistsList: {
    backgroundColor: '#d1edf9',
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    listStyle: 'none',
    margin: '0 1vw 1vh 1vw',
    maxHeight: '50vh',
    overflowY: 'scroll',
    paddingLeft: '2vw',
  },
  deletePlaylistTitle: {
    fontSize: SHARED_STYLES.FONT_SIZE_HEADER,
    margin: '2vh 0 0.5vh 0',
  },
  deleteTabPanel: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '3vh',
  },
  descriptionTextbox: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  filterButton: {
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    boxShadow: SHARED_STYLES.BOX_SHADOW_SCALED,
    fontSize: SHARED_STYLES.FONT_SIZE_SMALL,
    height: SHARED_STYLES.BUTTON_HEIGHT,
    marginLeft: '0.5vw',
    minWidth: '0',
    padding: '2vh 3vw',
  },
  filterContainer: {
    alignItems: 'center',
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    boxShadow: SHARED_STYLES.BOX_SHADOW_SCALED,
    display: 'flex',
    height: '7vh',
    justifyContent: 'space-evenly',
    margin: 'auto 1vw auto 0',
    padding: '1vh 0',
    width: '75%',
  },
  filterHeader: {
    alignItems: 'flex-end',
    display: 'flex',
    height: '11vh',
  },
  filterInputContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  filterOptions: {
    display: 'inline-flex',
    justifyContent: 'space-around',
    marginTop: '0.7vh',
    width: '100%',
  },
  filterSubContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  flexHorizontal: {
    display: 'flex',
    height: '84vh',
  },
  flexVertical: {
    display: 'flex',
    flexDirection: 'column',
    height: SHARED_STYLES.PAGE_HEIGHT,
    margin: '0 1vw',
    overflow: 'hidden',
    position: 'relative',
  },
  inputTextbox: {
    width: '18vw',
  },
  listContainer: {
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    boxShadow: SHARED_STYLES.BOX_SHADOW_SCALED,
    display: 'flex',
    flexDirection: 'column',
    margin: '0 1vw 1vh 0',
    textAlign: 'center',
    width: '75%',
  },
  messageError: {
    color: 'red',
    fontSize: SHARED_STYLES.FONT_SIZE_XLARGE,
    fontWeight: 'bold',
  },
  optionsMessage: {
    color: '#666666',
    fontSize: SHARED_STYLES.FONT_SIZE_SMALL,
    padding: '0 2vw',
  },
  optionsTab: {
    backgroundColor: 'white',
    borderRadius: '0 0 ' + SHARED_STYLES.BORDER_RADIUS + ' ' + SHARED_STYLES.BORDER_RADIUS,
    boxShadow: SHARED_STYLES.BOX_SHADOW_SCALED,
    marginBottom: '1vh',
    textAlign: 'center',
    width: '25%',
  },
  selectButton: {
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    boxShadow: SHARED_STYLES.BOX_SHADOW_SCALED,
    fontSize: SHARED_STYLES.FONT_SIZE_SMALL,
    height: SHARED_STYLES.BUTTON_HEIGHT,
    minWidth: '0',
    padding: '2vh 2vw',
    whiteSpace: 'nowrap'
  },
  selectButtons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '40%',
  },
  settingsCheckbox: {
    height: SHARED_STYLES.FONT_SIZE_XLARGE,
    margin: '0',
    padding: '1vh 0.5vw',
    width: SHARED_STYLES.FONT_SIZE_XLARGE,
  },
  settingsLabel: {
    fontSize: SHARED_STYLES.FONT_SIZE_SMALL,
    marginLeft: '1vw',
  },
  tabHeader: {
    fontSize: SHARED_STYLES.FONT_SIZE_HEADER,
  },
  tabList: {
    display: 'flex',
    marginBottom: '-0.2vh',
    padding: 0,
    width: '25%',
  },
  textbox: {
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    borderWidth: '0.2vh',
    fontSize: SHARED_STYLES.FONT_SIZE_LARGE,
    padding: '1.2vh 1vw',
  },
  textInputDiv: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2vh',
  },
  useRegexDiv: {
    display: 'inline-flex',
  }
});

const MESSAGE_TIMEOUT = 5000;

class Manager extends Component {
  constructor(props) {
    super(props);

    if (SpotifyPlaylistManager.getAccessToken()) {
      SpotifyPlaylistManager.getPlaylistData(false, true).then(data => {
        this.setState({
          filterMonthly: false,
          filterWithRegex: false,
          playlists: data['playlists'],
          shouldMakeCollaborative: false,
          shouldMakePublic: false,
          shouldRemoveDuplicates: true,
          songs: data['songs'],
          // Indices of the playlists that have been selected.
          selectedIndices: [],
          // Indices of the playlists that are currently visible (through filtering).
          visibleIndices: [],
        }, () => {
          // On initialization, will filter to show all playlists.
          this.clearLoadingInterval();
          this.filterPlaylists();
        });
      }).catch(error => {
        this.setState({ error });
      });
    }
  }

  componentDidMount = () => {
    this.setState({
      loadingInterval: setInterval(() => {
        this.setState({
          loadingProgress: SpotifyPlaylistManager.getLoadingProgress(),
          loadingTotal: SpotifyPlaylistManager.getLoadingTotal()
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

  /**
   * Creates a playlist with the given settings and adds the selected songs to
   * it.
   */
  createPlaylist = () => {
    // Values set by the user in the options tab
    let name = document.getElementById('playlistNameInput').value;
    name = name === '' ? 'New Playlist' : name;
    const desc = document.getElementById('playlistDescriptionInput').value;
    const isPublic = this.state.shouldMakePublic;
    const collab = this.state.shouldMakeCollaborative;
    const removeDups = this.state.shouldRemoveDuplicates;

    SpotifyPlaylistManager.createPlaylist(name, desc, isPublic, collab).then(playlist => {
      const uris = [];
      this.state.selectedIndices.forEach(i => {
        this.state.songs[i].forEach(song => {
          if (!song.isLocalFile) {
            const uri = 'spotify:track:' + song.id;
            if (uris.indexOf(uri) === -1 || !removeDups) {
              uris.push(uri);
            }
          }
        })
      });

      if (uris.length > 0) {
        SpotifyPlaylistManager.addSongsToPlaylist(playlist.id, uris).then(() => {
          SpotifyPlaylistManager.fetchPlaylistById(playlist.id).then(res => {
            SpotifyPlaylistManager.getSongData([res]).then(songs => {
              this.notifyCreatedPlaylist(res, songs[0]);
            });
          });
        });
      } else {
        this.notifyCreatedPlaylist(playlist, []);
      }
      // Filter so we render the new playlist
    }).catch(() => {
      this.notifyError('Could not create playlist');
    });
  }

  /**
   * Deletes the selected playlists. After successful deletion, the playlists
   * are removed from the state playlists array and the selected and visible
   * playlists are reset.
   */
  deletePlaylists = () => {
    if (this.state.selectedIndices.length > 0) {
      this.setState({deletedPlaylistsLoading: true});
      const indices = this.state.selectedIndices.map(i => this.state.playlists[i].id);
      SpotifyPlaylistManager.deletePlaylists(indices).then(() => {
        let filteredPlaylists = filterDeletedPlaylists(indices, this.state.playlists);
        this.setState({
          playlists: filteredPlaylists,
          selectedIndices: [],
          visibleIndices: [],
        });
        // Filter after setting visibleIndices to empty so we don't try to render
        // the already deleted playlists
        this.filterPlaylists();
        this.setState({deletedPlaylistsLoading: false});
        this.notifyDeletedPlaylists(indices.length);
      }).catch(e => {
        console.log(e);
        this.notifyError('Could not delete playlist(s)');
        this.setState({deletedPlaylistsLoading: false});
      });
    }
  }

  /**
   * onKeyDown event handler for the filter input, so "enter" triggers filtering.
   * @param {Event} event
   */
  filterInputOnKeyDown = (event) => {
    if (event.key === "Enter") {
      this.filterPlaylists();
    }
  }

  /**
   * Filters the visible playlists by the search term in the filter input.
   */
  filterPlaylists = () => {
    const input = document.getElementById('filterInput');

    if (!this.state.filterWithRegex) {
      const filterText = input ? input.value.toLowerCase() : '';
      this.setState({
        visibleIndices: this.state.playlists
          .map((playlist, i) => [playlist, i])
          .filter(list => list[0].name.toLowerCase().includes(filterText))
          .map(list => list[1])
      });
    } else {
      const regex = input ? new RegExp(input.value) : new RegExp("");
      this.setState({
        visibleIndices: this.state.playlists
          .map((playlist, i) => [playlist, i])
          .filter(list => regex.test(list[0].name))
          .map(list => list[1])
      });
    }
  }

  /**
   * Displays a message that a playlist was created.
   * @param {JSON} playlist The playlist JSON object
   * @param {Array<JSON>} songs Array of JSON song objects
   */
  notifyCreatedPlaylist = (playlist, songs) => {
    this.state.playlists.unshift(playlist);
    this.state.songs.unshift(songs);

    this.setState({
      createdPlaylistData: [playlist.name, playlist.tracks.total],
      selectedIndices: this.state.selectedIndices.map(i => i + 1)
     });

    this.filterPlaylists();


    setTimeout(() => {
      this.setState({ createdPlaylistData: undefined });
    }, MESSAGE_TIMEOUT);
  }

  /**
   * Displays a message that playlist(s) were deleted.
   * @param {number} playlistsRemoved The number of playlists deleted.
   */
  notifyDeletedPlaylists = (playlistsRemoved) => {
    this.setState({ deletedPlaylistsCount: playlistsRemoved });

    setTimeout(() => {
      this.setState({ deletedPlaylistsCount: undefined });
    }, MESSAGE_TIMEOUT);
  }


  /**
   * Displays an error message in the options tab. Only handles create
   * and delete playlist errors.
   * @param {string} message The error message to display.
   */
  notifyError = (message) => {
    this.setState({ errorMessage: message });

    setTimeout(() => {
      this.setState({ errorMessage: undefined });
    }, MESSAGE_TIMEOUT);
  }

  /**
   * Select all playlists that fit the filter specifications.
   */
  selectAllPlaylists = () => {
    this.setState({
      selectedIndices: this.state.visibleIndices
    });
  }

  /**
   * When checkbox value is true, filter textbox content is updated to
   * filter for all monthly playlists, and use regex is set to true.
   */
  toggleFilterMonthly = () => {
    this.setState({
      filterMonthly: !this.state.filterMonthly,
      filterWithRegex: !this.state.filterMonthly
    });

    document.getElementById('filterInput').value = SOFT_MONTH_MATCH;
  }

  /**
   * Toggles whether the filter button filters using regex or not.
   * If false, does an exact text search.
   */
  toggleFilterWithRegex = () => {
    this.setState({
      filterWithRegex: !this.state.filterWithRegex
    });
  }

  /**
   * Toggles whether to make the new playlist collaborative or not.
   * NOTE: To create a collaborative playlist you must also set public to false.
   * To create collaborative playlists you must have granted
   * playlist-modify-private and playlist-modify-public scopes.
   */
  toggleMakeCollaborative = () => {
    const prevCollab = this.state.shouldMakeCollaborative;

    if (!prevCollab) {
      this.setState({
        shouldMakeCollaborative: !prevCollab,
        shouldMakePublic: false,
      });
    } else {
      this.setState({
        shouldMakeCollaborative: !prevCollab
      });
    }
  }

  /**
   * Toggles whether to make the new playlist public or not.
   */
  toggleMakePublic = () => {
    const prevPublic = this.state.shouldMakePublic;

    if (!prevPublic) {
      this.setState({
        shouldMakeCollaborative: false,
        shouldMakePublic: !prevPublic
      });
    } else {
      this.setState({
        shouldMakePublic: !prevPublic
      });
    }
  }

  /**
   * Toggles the given playlist to either be selected or unselected.
   * @param {number} index The index of the playlist object
   */
  togglePlaylist = (index) => {
    // Copy selected list in state to modify
    const copy = this.state.selectedIndices.slice(0);
    const indexInSelected = this.state.selectedIndices.indexOf(index);
    if (indexInSelected > -1) { // if found, remove
      copy.splice(indexInSelected, 1);
    } else { // otherwise push to list
      copy.push(index);
    }
    this.setState({ selectedIndices: copy });
  }

  /**
   * Toggles the setting to remove duplicates from the new playlist.
   */
  toggleRemoveDuplicates = () => {
    this.setState({ shouldRemoveDuplicates: !this.state.shouldRemoveDuplicates });
  }

  /**
   * Unselect all playlists.
   */
  unselectAllPlaylists = () => {
    this.setState({ selectedIndices: [] });
  }

  render() {
    const { classes } = this.props;

    // Go back to Home screen to fetch the Spotify access token.
    if (!this.state) {
      return <LoadingIndicator />;
    }

    const { error, loadingProgress, loadingTotal, playlists, selectedIndices, visibleIndices } = this.state;

    if (!SpotifyPlaylistManager.getAccessToken() || error) {
      return <Login />;
    } else if (loadingProgress || !playlists) {
      return <ProgressIndicator progress={loadingProgress} total={loadingTotal} />;
    }

    const createOptionsTab = this.renderCreateOptionsTab();
    const deleteOptionsTab = this.renderDeleteOptionsTab();

    return (
      <>
        <Tabs className={classes.flexVertical} defaultIndex={0}>
          <div className={classes.filterHeader}>
            <Paper elevation={1} className={classes.filterContainer}>
              <div className={classes.filterSubContainer}>
                <div className={classes.filterInputContainer}>
                  <input id='filterInput' className={classes.textbox}
                    onKeyDown={this.filterInputOnKeyDown} placeholder='Filter'/>
                  <Button className={classes.filterButton} variant='contained'
                    color='primary' onClick={this.filterPlaylists}>
                      Filter
                  </Button>
                </div>
                <div className={classes.filterOptions}>
                  <div className={classes.useRegexDiv}>
                    <input className={classes.settingsCheckbox} type='checkbox'
                      checked={this.state.filterWithRegex}
                      onChange={this.toggleFilterWithRegex} />
                    <Typography className={classes.settingsLabel} variant='body1'>
                      Use Regex
                    </Typography>
                  </div>
                  <div className={classes.useRegexDiv}>
                    <input className={classes.settingsCheckbox} type='checkbox'
                      checked={this.state.filterMonthly}
                      onChange={this.toggleFilterMonthly} />
                    <Typography className={classes.settingsLabel} variant='body1'>
                      Filter monthly playlists
                    </Typography>
                  </div>
                </div>
              </div>
              <div className={classes.selectButtons}>
                <Button className={classes.selectButton} variant='contained' color='secondary'
                  onClick={this.selectAllPlaylists}>
                  Select All </Button>
                <Button className={classes.selectButton} variant='contained' color='secondary'
                  onClick={this.unselectAllPlaylists}> Unselect All </Button>
              </div>
            </Paper>
            <TabList className={classes.tabList}>
              <Tab>
                <Typography className={classes.tabHeader} variant='h6'>
                  Create
                </Typography>
              </Tab>
              <Tab>
                <Typography className={classes.tabHeader} variant='h6'>
                  Delete
                </Typography>
              </Tab>
            </TabList>
          </div>
          <div className={classes.flexHorizontal}>
            <Paper elevation={3} className={classes.listContainer}>
              <PlaylistList
                playlists={playlists}
                selectedIndices={selectedIndices}
                visibleIndices={visibleIndices}
                togglePlaylist={this.togglePlaylist} />
            </Paper>
            <Paper elevation={3} className={classes.optionsTab}>
              <TabPanel>
                <div className={classes.createTabPanel}>
                  {createOptionsTab}
                </div>
              </TabPanel>
              <TabPanel>
                <div className={classes.deleteTabPanel}>
                  {deleteOptionsTab}
                </div>
              </TabPanel>
            </Paper>
          </div>
        </Tabs>
      </>
    );
  }

  renderCreateOptionsTab() {
    const { classes } = this.props;
    const { createdPlaylistData, errorMessage } = this.state;

    return (
      <>
        <div>
          <Typography className={classes.optionsMessage} variant='body1'>
            Select playlists and edit the settings below to create
            a custom combined playlist.
          </Typography>
        </div>
        <div className={classes.checkboxDiv}>
          <div className={classes.checkboxGroup}>
            <input className={classes.settingsCheckbox} type='checkbox'
              checked={this.state.shouldRemoveDuplicates}
              onChange={this.toggleRemoveDuplicates} />
            <Typography className={classes.settingsLabel} variant='body1'>
              Remove Duplicates
            </Typography>
          </div>
          <div className={classes.checkboxGroup}>
            <input className={classes.settingsCheckbox} type='checkbox'
              checked={this.state.shouldMakePublic}
              onChange={this.toggleMakePublic} />
            <Typography className={classes.settingsLabel} variant='body1'>
              Make Public
            </Typography>
          </div>
          <div className={classes.checkboxGroup}>
            <input className={classes.settingsCheckbox} type='checkbox'
              checked={this.state.shouldMakeCollaborative}
              onChange={this.toggleMakeCollaborative} />
            <Typography className={classes.settingsLabel} variant='body1'>
              Make Collaborative
            </Typography>
          </div>
        </div>
        <div className={classes.textInputDiv}>
           <input id='playlistNameInput' className={[classes.textbox, classes.inputTextbox].join(' ')}
              onKeyDown={this.filterInputOnKeyDown} placeholder='New Playlist'/>
        </div>
        <div className={classes.textInputDiv}>
          <textarea id='playlistDescriptionInput' rows='4' placeholder='Description'
            className={[classes.textbox, classes.inputTextbox, classes.descriptionTextbox].join(' ')}
            onKeyDown={this.filterInputOnKeyDown} />
        </div>
        <div className={classes.textInputDiv}>
          <Button className={classes.actionButton} variant='contained' color='primary'
            onClick={this.createPlaylist}> Create </Button>
        </div>

        {createdPlaylistData ?
          <Typography className={classes.createdPlaylistMessage} variant='body1'>
              {'Created ' + createdPlaylistData[0] + ' with ' + createdPlaylistData[1] +
                ' song' + (createdPlaylistData[1] !== 1 ? 's.' : '.')}
          </Typography> : null}

        {errorMessage ?
          <Typography className={classes.messageError} variant='body1'>
            {errorMessage}
          </Typography> : null}
      </>
    );
  }

  renderDeleteOptionsTab() {
    const { classes } = this.props;
    const { deletedPlaylistsCount, deletedPlaylistsLoading, errorMessage, selectedIndices } = this.state;
    const anyPlaylistsSelected = selectedIndices.length > 0;

    return (
      <>
        <div>
          <Typography className={classes.optionsMessage} variant='body1'>
            Delete all the playlists you have selected.
          </Typography>
        </div>
        <Typography className={classes.deletePlaylistTitle} variant='h4'>
          Playlists to delete
        </Typography>
        {anyPlaylistsSelected ?
          <ul className={classes.deletePlaylistsList}>
            {this.state.selectedIndices.map(i => {
              let playlist = this.state.playlists[i];
              return (
                <li key={i} className={classes.deletePlaylistsItem}>
                  <Typography className={classes.deletePlaylistsItemTitle} variant='body1'>
                    {playlist.name}
                  </Typography>
                  <Typography className={classes.deletePlaylistsItemSongs} variant='body1'>
                    ({playlist.tracks.total} songs)
                  </Typography>
                </li>
              );
            })}
          </ul> :
          <Typography className={classes.optionsMessage} variant='body1'>
            No playlists selected.
          </Typography>
        }
        <div className={classes.deletePlaylistsBtnDiv}>
          <Button className={classes.actionButton} variant='contained' color='primary'
            disabled={!anyPlaylistsSelected} onClick={this.deletePlaylists}> Delete </Button>
        </div>
        <div className={classes.deletePlaylistsFooterDiv}>
          {deletedPlaylistsLoading
            ?  <LoadingIndicator scale={40} />
            :  deletedPlaylistsCount
                 ?
                  <Typography className={classes.createdPlaylistMessage}
                    variant='body1'>
                    Deleted {deletedPlaylistsCount} playlist
                    {deletedPlaylistsCount !== 1 ? 's' : ''}.
                  </Typography>
                : null}
          {errorMessage ?
            <Typography className={classes.messageError} variant='body1'>
              {errorMessage}
            </Typography> : null}
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Manager);
