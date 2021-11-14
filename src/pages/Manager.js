import React, { Component } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import LoadingIndicator from '../components/LoadingIndicator';
import SpotifyAPIManager from '../utils/SpotifyAPIManager';
import ProgressIndicator from '../components/ProgressIndicator';
import PlaylistList from '../components/PlaylistList';

/**
 * This is preferred over using an external css file for styling because React
 * components that are imported have their own classes that override CSS classes
 * in external files. The CSS will actually follow this (some require the use
 * of important).
 */

const BORDER_RADIUS = '0.5vw';

const FONT_SIZE_SMALL = '1.4vh';
const FONT_SIZE_MED = '1.6vh';
const FONT_SIZE_LARGE = '1.8vh';
const FONT_SIZE_HEADER = '2.5vh';

const TEXTBOX_BORDER_WIDTH = '0.2vh';
const TEXTBOX_PADDING = '1.2vh 1vw';

const styles = () => ({
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
  createButton: {
    borderRadius: BORDER_RADIUS,
    fontSize: FONT_SIZE_LARGE,
    height: '4vh',
    minWidth: '0',
    padding: '2.5vh 2vw',
  },
  createdPlaylistMessage: {
    color: 'green',
    fontWeight: 'bold',
  },
  createTabPanel: {
    paddingTop: '3vh',
  },
  deletePlaylistBody: {
    margin: '4vh 1vw',
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
    padding: '1vh 1vw',
  },
  deletePlaylistsItemTitle: {
    display: 'inline',
    fontWeight: 'bold',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  deletePlaylistsItemSongs: {
    display: 'inline',
    fontSize: '12px',
    marginLeft: '1vw',
    whiteSpace: 'nowrap',
  },
  deletePlaylistsList: {
    backgroundColor: '#d1edf9',
    borderRadius: BORDER_RADIUS,
    listStyle: 'none',
    margin: '0 4vw 1vh 4vw',
    maxHeight: '60vh',
    overflowY: 'scroll',
    paddingLeft: '2vw',
  },
  deletePlaylistTitle: {
    margin: '4vh 0 2vh 0',
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
    borderRadius: BORDER_RADIUS,
    fontSize: FONT_SIZE_MED,
    height: '4vh',
    marginLeft: '0.5vw',
    minWidth: '0',
    padding: '2vh 3vw',
  },
  filterContainer: {
    alignItems: 'center',
    display: 'flex',
    height: '5vh',
    justifyContent: 'space-evenly',
    margin: 'auto 1vw auto 0',
    padding: '1vh 0',
    width: '75%',
  },
  filterHeader: {
    alignItems: 'flex-end',
    display: 'flex',
    height: '10vh',
  },
  filterInputContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '35%',
  },
  filterTextbox: {
    borderRadius: BORDER_RADIUS,
    borderWidth: TEXTBOX_BORDER_WIDTH,
    fontSize: FONT_SIZE_LARGE,
    padding: TEXTBOX_PADDING,
  },
  flexHorizontal: {
    display: 'flex',
    height: '85vh',
  },
  flexVertical: {
    display: 'flex',
    flexDirection: 'column',
    height: '95vh',
    margin: '0 1vw',
    overflow: 'hidden',
    position: 'relative',
  },
  inputTextbox: {
    borderRadius: BORDER_RADIUS,
    borderWidth: TEXTBOX_BORDER_WIDTH,
    fontSize: FONT_SIZE_LARGE,
    padding: TEXTBOX_PADDING,
    width: '18vw',
  },
  // The container to display all the playlists
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 1vw 1vh 0',
    textAlign: 'center',
    width: '75%',
  },
  nameInput: {
    marginBottom: '8px',
  },
  optionsMessage: {
    color: '#666666',
    fontSize: FONT_SIZE_SMALL,
    padding: '0 4vw',
  },
  optionsTab: {
    backgroundColor: 'white',
    borderRadius: '0',
    textAlign: 'center',
    width: '25%',
  },
  selectButton: {
    borderRadius: BORDER_RADIUS,
    fontSize: FONT_SIZE_MED,
    height: '4vh',
    minWidth: '0',
    padding: '2vh 2vw',
  },
  selectButtons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '35%',
  },
  settingsCheckbox: {
    height: '2vh',
    margin: '0',
    padding: '1vh 0.5vw',
    width: '2vh',
  },
  settingsLabel: {
    fontSize: FONT_SIZE_MED,
    marginLeft: '1vw',
  },
  // Summary component's area should expand to fit the remaining area.
  summary: {
    backgroundColor: '#F7F6FD',
    margin: '0 auto',
    textAlign: 'center',
    width: '87%',
  },
  tabHeader: {
    fontSize: FONT_SIZE_HEADER,
  },
  tabList: {
    display: 'flex',
    marginBottom: '-0.2vh',
    padding: 0,
    width: '25%',
  },
  textInputDiv: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2vh',
  },
  textField: {
    width: '80%',
  }
});

const MESSAGE_TIMEOUT = 5000;

class Manager extends Component {
  constructor(props) {
    super(props);

    if (SpotifyAPIManager.getAccessToken()) {
      // TODO: should be false, true
      SpotifyAPIManager.getPlaylistData(false, false).then(data => {
        this.setState({
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

  /**
   * Creates a playlist with the given settings and adds the selected songs to
   * it.
   */
  createPlaylist = () => {
    // Values set by the user in the options tab
    const name = document.getElementById('playlistNameInput').value;
    const desc = document.getElementById('playlistDescriptionInput').value;
    const isPublic = this.state.shouldMakePublic;
    const collab = this.state.shouldMakeCollaborative;
    const removeDups = this.state.shouldRemoveDuplicates;

    SpotifyAPIManager.createPlaylist(name, desc, isPublic, collab).then(res => {
      const uris = []
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
        SpotifyAPIManager.addSongsToPlaylist(res.id, uris).then(() => {
          this.notifyCreatedPlaylist(name, uris.length);
        })
      } else {
        this.notifyCreatedPlaylist(name, 0);
      }
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
      const ids = this.state.selectedIndices.map(i => this.state.playlists[i].id);
        SpotifyAPIManager.deletePlaylists(ids).then(() => {
          let copy = this.state.playlists.slice();
          // Remove deleted playlists from state playlist array
          this.state.selectedIndices.forEach(i => { copy.splice(i, 1); });
          // Set playlists to new copy and reset selected and visible playlists
          this.setState({
            playlists: copy,
            selectedIndices: [],
            visibleIndices: [],
          });
          // Filter after setting visibleIndices to empty so we don't try to render
          // the already deleted playlists
          this.filterPlaylists();
          this.setState({deletedPlaylistsLoading: false});
          this.notifyDeletedPlaylists(ids.length);
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
    const filterText = input ? input.value.toLowerCase() : '';

    this.setState({
      visibleIndices: this.state.playlists
        .map((playlist, i) => [playlist, i])
        .filter(list => list[0].name.toLowerCase().includes(filterText))
        .map(list => list[1])
    });
  }

  /**
   * Displays a message that a playlist was created.
   * @param {string} playlistName The name of the playlist.
   * @param {number} songsAdded The number of songs added (also displayed).
   */
  notifyCreatedPlaylist = (playlistName, songsAdded) => {
    this.setState({ createdPlaylistData: [playlistName, songsAdded] });

    setTimeout(() => {
      this.setState({ createdPlaylistData: null });
    }, MESSAGE_TIMEOUT);
  }

  notifyDeletedPlaylists = (playlistsRemoved) => {
    this.setState({ deletedPlaylistsCount: playlistsRemoved });

    setTimeout(() => {
      this.setState({ deletedPlaylistsCount: null });
    }, MESSAGE_TIMEOUT);
  }

  /**
   * Select all playlists that fit the filter specifications.
   */
  selectAllPlaylists = () => {
    console.log(this.state);
    this.setState({
      selectedIndices: this.state.visibleIndices
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
    const accessToken = SpotifyAPIManager.getAccessToken();

    // Go back to Home screen to fetch the Spotify access token.
    if (!this.state) {
      return <LoadingIndicator />;
    } else if (!accessToken) {
      window.location.replace('/');
    } else if (this.state.error) {
      return (<div> retry ? </div>);
    } else if (this.state.loadingProgress || !this.state.playlists) {
      return <ProgressIndicator progress={this.state.loadingProgress} total={this.state.loadingTotal} />;
    }

    const { playlists, selectedIndices, visibleIndices } = this.state;

    const createOptionsTab = this.renderCreateOptionsTab();
    const deleteOptionsTab = this.renderDeleteOptionsTab();

    return (
      <>
        <Tabs className={classes.flexVertical} defaultIndex={0}>
          <div className={classes.filterHeader}>
            <Paper elevation={1} className={classes.filterContainer}>
              <div className={classes.filterInputContainer}>
                <input id='filterInput' className={classes.filterTextbox}
                  onKeyDown={this.filterInputOnKeyDown} placeholder='Filter'/>
                <Button className={classes.filterButton} variant='contained' color='primary'
                  onClick={this.filterPlaylists}> Filter
                </Button>
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
    const { createdPlaylistData } = this.state;

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
           <input id='playlistNameInput' className={classes.inputTextbox}
              onKeyDown={this.filterInputOnKeyDown} placeholder='New Playlist'/>
          {/* <TextField required className={classes.textField}
            id='playlistNameInput' label='Playlist Name' variant='outlined'
            defaultValue='New Playlist' /> */}
        </div>
        <div className={classes.textInputDiv}>
          <textarea id='playlistDescriptionInput' rows='4' placeholder='Description'
            className={[classes.inputTextbox, classes.descriptionTextbox].join(' ')}
            onKeyDown={this.filterInputOnKeyDown} />
          {/* <TextField multiline label='Description' rows={4} className={classes.textField}
            id='playlistDescriptionInput' variant='outlined' /> */}
        </div>
        <div className={classes.textInputDiv}>
          <Button className={classes.createButton} variant='contained'
            color='primary' onClick={this.createPlaylist}> Create </Button>
        </div>

        {createdPlaylistData ?
          <Typography className={classes.createdPlaylistMessage}
            variant='body1'>
            Created '{createdPlaylistData[0]}' with {' '} {createdPlaylistData[1]}
            {' '} song{createdPlaylistData[1] !== 1 ? 's' : ''}.
          </Typography> : null}
      </>
    );
  }

  renderDeleteOptionsTab() {
    const { classes } = this.props;
    const { deletedPlaylistsCount, deletedPlaylistsLoading, selectedIndices } = this.state;

    const anyPlaylistsSelected = selectedIndices.length > 0;

    return (
      <>
        <div>
          <Typography className={classes.optionsMessage} variant='body1'>
            Delete all the playlists you have selected.
          </Typography>
        </div>
        <Typography className={classes.deletePlaylistTitle} variant='h5'>
          Playlists you're deleting
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
          <Button variant='contained' color='primary' disabled={!anyPlaylistsSelected}
            onClick={this.deletePlaylists}> Delete </Button>
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
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Manager);