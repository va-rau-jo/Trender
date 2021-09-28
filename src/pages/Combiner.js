import React, { Component } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  ImageList,
  ImageListItem,
  ListSubheader,
  Tab,
  TabList,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';

import LoadingIndicator from '../components/LoadingIndicator';
import SpotifyAPIManager from '../utils/SpotifyAPIManager';
import Header from '../components/Header';

/**
 * This is preferred over using an external css file for styling because React
 * components that are imported have their own classes that override CSS classes
 * in external files. The classes defined here will override the CSS classes
 * that the React components provide. The CSS will actually follow this!
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
  // compare button on list items
  compareBtn: {
    height: '20px',
    width: '20px',
  },
  createdPlaylistMessage: {
    color: 'green',
    fontWeight: 'bold',
    left: '15px',
    position: 'absolute',
    right: '15px',
    top: '102%'
  },
  // Max width of drawer container
  drawerContainer: {
    width: '160px',
  },
  filterButton: {
    marginLeft: '4px',
  },
  filterContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: '16px',
  },
  filterInputContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  // Parent div to display the sidebar and summary
  flex: {
    display: 'flex',
    height: '90%',
  },
  listCheckbox: {
    bottom: '0',
    position: 'absolute',
    right: '5px',
    top: '0',
  },
  // The container to display all the playlists
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    textAlign: 'center',
  },
  listItemDescription: {
    backgroundColor: '#000000CC',
    borderRadius: '0 0 10px 10px',
    bottom: '0',
    height: '65px',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
  },
  listItemIndexDiv: {
    position: 'absolute',
    right: '5px',
    top: '5px',
  },
  listItemIndex: {
    backgroundColor: '#000000CC',
    borderRadius: '50%',
    color: 'white',
    padding: '0 8px',
  },
  listItemText: {
    color: 'white',
  },
  nameInput: {
    marginBottom: '8px',
  },
  optionsDiv: {
    flexShrink: '0',
    height: 'fit-content',
    margin: 'auto',
    position: 'relative',
    textAlign: 'center',
    width: '350px',
  },
  playlistList: {
    background: 'white',
    borderRadius: '10px',
    justifyContent: 'space-evenly',
    // overrides ImageList inline style
    margin: '5px 20px 20px 20px !important',
    padding: '20px',
    transform: 'translateZ(0)',
  },
  playlistListImage: {
    borderRadius: '10px',
  },
  // Overriding default inline style for ListItem
  playlistListItem: {
    border: '4px solid white',
    borderRadius: '16px',
    cursor: 'pointer',
    height: '250px !important',
    margin: '5px',
    padding: '0px !important',
    width: '250px !important',
  },
  removeDuplicates: {
    display: 'block',
  },
  selectAllBtn: {
    marginRight: '8px',
  },
  selectedListItem: {
    border: '4px solid #ff2d52',
  },
  subheader: {
    fontSize: '20px',
  },
  // Summary component's area should expand to fit the remaining area.
  summary: {
    backgroundColor: '#F7F6FD',
    margin: '0 auto',
    textAlign: 'center',
    width: '87%',
  },
  textInputDiv: {
    marginBottom: '8px',
  },
});

// Custom checkbox to be invisible when unchecked but a nice color when checked.
const HiddenCheckbox = withStyles({
  root: {
    color: '#00000000', // invisible
    '&$checked': {
      color: '#ff2d52',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const CREATED_PLAYLIST_MESSAGE_TIMEOUT = 5000;

class Combiner extends Component {
  constructor(props) {
    super(props);

    console.log("accesstoken: " + SpotifyAPIManager.getAccessToken())
    if (SpotifyAPIManager.getAccessToken()) {
      SpotifyAPIManager.getPlaylistData(false, true).then(data => {
        this.setState({
          playlists: data['playlists'],
          shouldMakeCollaborative: false,
          shouldMakePublic: false,
          shouldRemoveDuplicates: true,
          songs: data['songs'],
          selectedPlaylists: [],
          visiblePlaylists: [],
        }, () => {
          console.log(this.state.playlists);
          // On initialization, will filter to show all playlists.
          this.filterPlaylists();
        });
      }).catch(error => {
        this.setState({ error });
      });
    }
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
      this.state.selectedPlaylists.forEach(playlistId => {
        this.state.playlists.forEach((playlist, i) => {
          if (playlist.id === playlistId) { // only match selected playlists
            this.state.songs[i].forEach(song => {
              if (!song.isLocalFile) {
                const uri = 'spotify:track:' + song.id;
                if (uris.indexOf(uri) === -1 || !removeDups) {
                  uris.push(uri);
                }
              }
            })
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
   * Filters the visible playlists by the search term in the filter input.
   */
  filterPlaylists = () => {
    const input = document.getElementById('filterInput');
    const filterText = input ? input.value.toLowerCase() : '';

    this.setState({
      visiblePlaylists: this.state.playlists
        .filter(playlist => playlist.name.toLowerCase().includes(filterText))
        .map(playlist => playlist.id)
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
    }, CREATED_PLAYLIST_MESSAGE_TIMEOUT);
  }

  /**
   * Select all playlists that fit the filter specifications.
   */
  selectAllPlaylists = () => {
    console.log(this.state);
    this.setState({
      selectedPlaylists: this.state.playlists
        .filter(playlist => this.state.visiblePlaylists.includes(playlist.id))
        .map(playlist => playlist.id)
    });
  }

  /**
   * Toggles whether to make the new playlist collaborative or not.
   * NOTE: To create a collaborative playlist you must also set public to false.
   * To create collaborative playlists you must have granted
   * playlist-modify-private and playlist-modify-public scopes.
   */
  toggleMakeCollaborative = () => {
    if (!this.state.shouldMakePublic) {
      this.setState({
        shouldMakeCollaborative: !this.state.shouldMakeCollaborative
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
        shouldMakePublic: !this.state.shouldMakePublic
      });
    } else {
      this.setState({
        shouldMakePublic: !this.state.shouldMakePublic
      });
    }
  }

  /**
   * Toggles the given playlist to either be selected or unselected.
   * @param {JSON} playlist The playlist object
   */
  togglePlaylist = (playlist) => {
    const selected = this.state.selectedPlaylists.slice(0);
    const index = selected.indexOf(playlist.id);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(playlist.id);
    }
    this.setState({ selectedPlaylists: selected });
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
    this.setState({ selectedPlaylists: [] });
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
    }

    const { selectedPlaylists, visiblePlaylists } = this.state;

    return (
      <div className={classes.body}>
        <Header title='Combine Your Playlists' />
        <div className={classes.flex}>
          <div className={classes.listContainer}>
            <div className={classes.filterContainer}>
              <div className={classes.filterInputContainer}>
                <TextField id="filterInput" label="Filter" variant="outlined" />
                <Button className={classes.filterButton} variant="contained" color="primary"
                  onClick={this.filterPlaylists}> Filter
                </Button>
              </div>
              <div>
                <Button className={classes.selectAllBtn} variant="contained" color="secondary"
                  onClick={this.selectAllPlaylists}>
                  Select All </Button>
                <Button variant="contained" color="secondary"
                  onClick={this.unselectAllPlaylists}> Unselect All </Button>
              </div>
            </div>
            <ImageList className={classes.playlistList}>
              <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }}>
                <ListSubheader className={classes.subheader} component="div">
                  Playlists
                </ListSubheader>
              </ImageListItem>
              {this.state.playlists.map((playlist) => {
                const visible = visiblePlaylists.indexOf(playlist.id) > -1;
                const selected = selectedPlaylists.indexOf(playlist.id) > -1;
                if (visible) {
                  return (
                    <ImageListItem cols={2} key={playlist.id} onClick={() => { this.togglePlaylist(playlist) }}
                      className={classes.playlistListItem + ' ' + (selected ? classes.selectedListItem : '')}>
                      <img className={classes.playlistListImage} alt="Playlist"
                        src={playlist.images[0] ? playlist.images[0].url : "/images/sound_file.png"} />
                      {selected ?
                        <div className={classes.listItemIndexDiv}>
                          <Typography className={classes.listItemIndex} variant='h6'>
                            {(selectedPlaylists.indexOf(playlist.id) + 1)}
                          </Typography>
                        </div> : null}

                      <div className={classes.listItemDescription}>
                        <Typography className={classes.listItemText} variant='h6'>
                          {playlist.name}
                        </Typography>
                        <Typography className={classes.listItemText} variant='subtitle1'>
                          {playlist.tracks.total} Songs
                        </Typography>
                        <HiddenCheckbox id={playlist.id + 'checkbox'} checked={selected}
                          className={classes.listCheckbox} />
                      </div>
                    </ImageListItem>
                  );
                }
              })}
            </ImageList>
          </div>
          <div>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Item One" value="1" />
              <Tab label="Item Two" value="2" />
              <Tab label="Item Three" value="3" />
            </TabList>
            <TabPanel value="1">
              <div className={classes.optionsDiv}>
                <div className={classes.checkboxDiv}>
                  <FormControlLabel className={classes.removeDuplicates}
                    control={
                      <Checkbox color="primary"
                        checked={this.state.shouldRemoveDuplicates}
                        onChange={this.toggleRemoveDuplicates} />}
                    label="Remove Duplicates"
                  />
                  <FormControlLabel className={classes.removeDuplicates}
                    control={
                      <Checkbox color="primary"
                        checked={this.state.shouldMakePublic}
                        onChange={this.toggleMakePublic} />}
                    label="Make Public"
                  />
                  <FormControlLabel className={classes.removeDuplicates}
                    control={
                      <Checkbox color="primary"
                        checked={this.state.shouldMakeCollaborative}
                        onChange={this.toggleMakeCollaborative} />}
                    label="Make Collaborative"
                  />
                </div>
                <div className={classes.textInputDiv}>
                  <TextField required className={classes.nameInput}
                    id="playlistNameInput" label="Playlist Name" variant="outlined"
                    defaultValue="New Playlist" />
                </div>
                <div className={classes.textInputDiv}>
                  <TextField multiline label="Description" rows={4}
                    id='playlistDescriptionInput' variant='outlined' />
                </div>
                <Button variant="contained" color="primary"
                  onClick={this.createPlaylist}> Create </Button>

                {this.state.createdPlaylistData ?
                  <Typography className={classes.createdPlaylistMessage}
                    variant='body1'>
                    Created '{this.state.createdPlaylistData[0]}' with {' '}
                    {this.state.createdPlaylistData[1]} {' '}
                    song{this.state.createdPlaylistData[1] !== 1 ? 's' : ''}.
                  </Typography> : null}
              </div>
            </TabPanel>
            <TabPanel value="2" >

            </TabPanel>
          </div>
         
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Combiner);