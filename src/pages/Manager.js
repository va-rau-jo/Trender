import React, { Component } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
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
const styles = () => ({
  body: {
    height: '100%',
  },
  checkboxDiv: {
    margin: '24px auto',
    textAlign: 'left',
    width: 'fit-content',
  },
  compareBtn: {
    height: '20px',
    width: '20px',
  },
  createdPlaylistMessage: {
    color: 'green',
    fontWeight: 'bold',
  },
  createTabPanel: {
    paddingTop: '24px',
  },
  deletePlaylistBody: {
    margin: '32px 8px',
  },
  deletePlaylistsBtnDiv: {
    marginTop: '16px',
  },
  deletePlaylistsFooterDiv: {
    marginTop: '32px',
  },
  deletePlaylistsItem: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    padding: '8px',
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
    marginLeft: '8px',
    whiteSpace: 'nowrap',
  },
  deletePlaylistsList: {
    backgroundColor: '#d1edf9',
    borderRadius: '10px',
    listStyle: 'none',
    margin: '0 32px 8px 32px',
    maxHeight: '60vh',
    overflowY: 'scroll',
    paddingLeft: '20px',
  },
  deletePlaylistTitle: {
    margin: '32px 0 16px 0',
  },
  deleteTabPanel: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '24px',
  },
  filterButton: {
    marginLeft: '4px',
  },
  filterContainer: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'space-evenly',
    margin: '16px 0 4px 0',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  filterInputContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  flexHorizontal: {
    display: 'flex',
    height: '90%',
  },
  flexVertical: {
    display: 'flex',
    flexDirection: 'column',
    height: '90%',
    margin: '0px 20px',
    position: 'relative',
  },
  // The container to display all the playlists
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    textAlign: 'center',
  },
  nameInput: {
    marginBottom: '8px',
  },
  optionsMessage: {
    color: '#666666',
    fontSize: '14px',
    padding: '0 32px',
  },
  optionsTab: {
    backgroundColor: 'white',
    minWidth: '350px',
    textAlign: 'center',
  },
  removeDuplicates: {
    display: 'block',
  },
  selectAllBtn: {
    marginRight: '8px',
  },
  // Summary component's area should expand to fit the remaining area.
  summary: {
    backgroundColor: '#F7F6FD',
    margin: '0 auto',
    textAlign: 'center',
    width: '87%',
  },
  tabList: {
    display: 'flex',
    marginBottom: '0',
    width: '350px',
  },
  textInputDiv: {
    marginBottom: '16px',
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
      SpotifyAPIManager.getPlaylistData(false, true).then(data => {
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
    const { accessToken, classes } = this.props;

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
            <div className={classes.filterContainer}>
              <div className={classes.filterInputContainer}>
                <TextField id='filterInput' label='Filter' variant='outlined'
                  onKeyDown={this.filterInputOnKeyDown} />
                <Button className={classes.filterButton} variant='contained' color='primary'
                  onClick={this.filterPlaylists}> Filter
                </Button>
              </div>
              <div>
                <Button className={classes.selectAllBtn} variant='contained' color='secondary'
                  onClick={this.selectAllPlaylists}>
                  Select All </Button>
                <Button variant='contained' color='secondary'
                  onClick={this.unselectAllPlaylists}> Unselect All </Button>
              </div>
            </div>
            <TabList className={classes.tabList}>
              <Tab> <Typography variant='h6'> Create </Typography> </Tab>
              <Tab> <Typography variant='h6'> Delete </Typography> </Tab>
            </TabList>
          </div>
          <div className={classes.flexHorizontal}>
            <div className={classes.listContainer}>
              <PlaylistList
                playlists={playlists}
                selectedIndices={selectedIndices}
                visibleIndices={visibleIndices}
                togglePlaylist={this.togglePlaylist} />
            </div>
            <div className={classes.optionsTab}>
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
            </div>
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
          <FormControlLabel className={classes.removeDuplicates}
            control={
              <Checkbox color='primary'
                checked={this.state.shouldRemoveDuplicates}
                onChange={this.toggleRemoveDuplicates} />}
            label='Remove Duplicates'
          />
          <FormControlLabel className={classes.removeDuplicates}
            control={
              <Checkbox color='primary'
                checked={this.state.shouldMakePublic}
                onChange={this.toggleMakePublic} />}
            label='Make Public'
          />
          <FormControlLabel className={classes.removeDuplicates}
            control={
              <Checkbox color='primary'
                checked={this.state.shouldMakeCollaborative}
                onChange={this.toggleMakeCollaborative} />}
            label='Make Collaborative'
          />
        </div>
        <div className={classes.textInputDiv}>
          <TextField required className={classes.textField}
            id='playlistNameInput' label='Playlist Name' variant='outlined'
            defaultValue='New Playlist' />
        </div>
        <div className={classes.textInputDiv}>
          <TextField multiline label='Description' rows={4} className={classes.textField}
            id='playlistDescriptionInput' variant='outlined' />
        </div>
        <Button variant='contained' color='primary'
          onClick={this.createPlaylist}> Create </Button>

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