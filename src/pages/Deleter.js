import React, { Component } from 'react';
import {
  Button,
  ImageList,
  ImageListItem,
  ListSubheader,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';
import LoadingIndicator from '../components/LoadingIndicator';
import SpotifyAPIManager from '../utils/SpotifyAPIManager';
import ProgressIndicator from '../components/ProgressIndicator';

/**
 * This is preferred over using an external css file for styling because React
 * components that are imported have their own classes that override CSS classes
 * in external files. The classes defined here will override the CSS classes
 * that the React components provide. The CSS will actually follow this!
 */
const styles = () => ({
  body: {
    height: '100%',
    textAlign: 'center',
  },
  buttonDiv: {
    marginTop: '8px',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    height: '90%',
  },
  inputDiv: {
    minHeight: '400px',
  },
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
  listItemText: {
    color: 'white',
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
    height: '200px !important',
    margin: '5px',
    padding: '0px !important',
    width: '200px !important',
  },
  textField: {
    marginTop: '24px',
  }
});

class Deleter extends Component {
  constructor(props) {
    super(props);

    console.log("accesstoken: " + SpotifyAPIManager.getAccessToken())
    if (SpotifyAPIManager.getAccessToken()) {
      SpotifyAPIManager.getPlaylistData(false, true).then(data => {
        this.setState({ playlists: data['playlists'] }, () => {
          this.clearLoadingInterval();
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

  deletePlaylists = () => {
    const input = document.getElementById('playlistNameInput');
    const text = input ? input.value : '';
    SpotifyAPIManager.deletePlaylists(this.state.playlists, text)
      .then(res => {
        console.log(res);
      });
  }

  render() {
    const { accessToken, classes } = this.props;

    // Go back to Home screen to fetch the Spotify access token.
    if (this.state) {
      if (!accessToken) {
        window.location.replace('/');
      } else if (this.state.error) {
        return (<div> retry ? </div>);
      } else if (this.state.loadingProgress) {
        return <ProgressIndicator progress={this.state.loadingProgress} total={this.state.loadingTotal} />;
      } else if (this.state.playlists) {
        return (
          <div className={classes.body}>
            <div className={classes.flex}>
              <div className={classes.listContainer}>
                <ImageList className={classes.playlistList}>
                  <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }}>
                    <ListSubheader className={classes.subheader} component="div">
                      Playlists
                    </ListSubheader>
                  </ImageListItem>
                  {this.state.playlists.map((playlist) => {
                    return (
                      <ImageListItem cols={2} key={playlist.id} className={classes.playlistListItem}>
                        <img className={classes.playlistListImage} alt="Playlist"
                          src={playlist.images[0] ? playlist.images[0].url : "/images/sound_file.png"} />
                        <div className={classes.listItemDescription}>
                          <Typography className={classes.listItemText} variant='h6'>
                            {playlist.name}
                          </Typography>
                          <Typography className={classes.listItemText} variant='subtitle1'>
                            {playlist.tracks.total} Songs
                          </Typography>
                        </div>
                      </ImageListItem>
                    );
                  })}
                </ImageList>
              </div>
              <div className={classes.inputDiv}>
                <div className={classes.textField}>
                  <TextField required className={classes.nameInput} id="playlistNameInput"
                    label="Playlist Name" variant="outlined" />
                </div>
                <div classes={classes.buttonDiv}>
                  <Button variant="contained" color="primary" onClick={this.deletePlaylists}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
    return <LoadingIndicator />;
  }
}

export default withStyles(styles)(Deleter);