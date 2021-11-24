import React, { Component } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  withStyles
} from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Slider, VolumeDown, VolumeUp } from '@mui/material';

import { verifyImageUrl } from '../../utils/helpers';
import { SHARED_STYLES } from '../../utils/sharedStyles';
import SpotifyAPIManager from '../../utils/Spotify/SpotifyAPIManager';
import PlaybackMenu from './PlaybackMenu';

// !important needed to override the CloseIcon and IconButton styling
const styles = () => ({
  contentHeader: {
    // border: '1px solid red',
    display: 'flex',
  },
  closeButton: {
    padding: '0.5vh 0.1vw !important',
    position: 'absolute !important',
    right: '0',
    top: '0.5vh',
  },
  closeButtonSvg: {
    height: '3vh !important',
  },
  ellipsisText: {
    margin: SHARED_STYLES.OVERLAY_TEXT_MARGIN,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  playButton: {
    borderRadius: '5vw',
    cursor: 'pointer',
    padding: '0.5vw',
    width: '3vh',
    '&:hover': {
      backgroundColor: '#dedede'
    },
  },
  playDiv: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  playLabel: {
    fontSize: SHARED_STYLES.FONT_SIZE_MED,
    marginTop: '2vh',
  },
  songArtist: {
    fontSize: SHARED_STYLES.FONT_SIZE_HEADER,
    fontWeight: 'bold',
  },
  songDescription: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    marginLeft: '1vw',
  },
  songImage: {
    borderRadius: '1vh',
    height: '18vh',
  },
  songInfo: {
    display: 'flex',    
  },
  songTitle: {
    fontSize: SHARED_STYLES.FONT_SIZE_GIANT,
    fontWeight: 'bold',
  },
  timespanDescription: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '1vh'
  },
  timespanHeader: {
    fontSize: '3vh',
  },
  timespanResultDiv: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1vh'
  },
  timespanSection: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  timespanValue: {
    fontSize: '2vh',
  },
  volumeSlider: {
    height: '3vh'
  }
});

const PLAYER_BASE_URL = 'https://api.spotify.com/v1/me/player/';

class SongInfoDialog extends Component {
  constructor(props) {
    super(props);

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
          name: 'Trender Spotify Player',
          getOAuthToken: cb => { cb(SpotifyAPIManager.getAccessToken()); }
      });

      // player.addListener('player_state_changed', () => {console.log('player state changed')});
      this.state = {spotifyPlayer: player, volume: 50};
      this.connectToPlayer();
    }

    document.body.appendChild(script);
  }

  connectToPlayer = () => {
    if (this.state.spotifyPlayer) {
        clearTimeout(this.connectToPlayerTimeout);
        this.state.spotifyPlayer.addListener('ready', ({device_id}) => {
          this.setState({
              loadingState: 'spotify player ready',
              spotifyDeviceId: device_id,
              spotifyPlayerReady: true
          });
        });

        this.state.spotifyPlayer.addListener('not_ready', ({device_id}) => {
          this.setState({error: 'Device id has gone offline ' + device_id});
        });

        this.state.spotifyPlayer.connect()
          .then(_ => {
              this.setState({loadingState: 'connected to player'});
          });
    } else {
      this.connectToPlayerTimeout = setTimeout(this.connectToPlayer.bind(this), 1000);
    }
  }

  playTrack = () => {
    fetch(PLAYER_BASE_URL + 'play?device_id=' + this.state.spotifyDeviceId, {
      method: 'PUT',
      body: JSON.stringify({uris: [this.props.song.uri]}),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SpotifyAPIManager.getAccessToken()}`
      }
    }).then(async res => {
        console.log(res);
        if (res.status === 403) {
          this.setState({ error: 'Spotify Premium is required to play songs' });
        } else {
          this.setState({
            songPaused: false,
            songStarted: true,
          });
          console.log('Started playback', this.state);
        }
    }).catch((error) => {
        this.setState({loadingState: 'playback error: ' + error});
    })
  };

  resumeTrack = () => {
    if (this.state.songStarted && this.state.songPaused) {
      fetch(PLAYER_BASE_URL + 'play?device_id=' + this.state.spotifyDeviceId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SpotifyAPIManager.getAccessToken()}`
        },
      }).then((ev) => {
        this.setState({songPaused: false});
      });
      console.log("Started playback", this.state);
    }
  }

  pauseTrack = () => {
    if (!this.state.songPaused) {
      fetch(PLAYER_BASE_URL + 'pause?device_id=' + this.state.spotifyDeviceId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SpotifyAPIManager.getAccessToken()}`
          },
      }).then((ev) => {
        this.setState({songPaused: true});
      });
    }
  }

  spotifySDKCallback = () => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log(window);
      console.log(window.Spotify);            
      // const token = '[My Spotify Web API access token]';
      const player = new window.Spotify.Player({
          name: 'Spotify Demo Player',
          getOAuthToken: cb => { cb(SpotifyAPIManager.getAccessToken()); }
      });

      player.addListener('player_state_changed', () => {console.log('player state changed')});
      this.setState({spotifyPlayer: player});
    }
  }

  onClose = () => {
    this.setState({ songPaused: false, songStarted: false });
    this.props.onClose();
  }

  onVolumeChange = (event, volume) => {
    if (volume !== this.state.volume) {
      this.setState({volume: volume});
      console.log('volume: ' + volume);
    }
  }

  render() {
    const { classes, isOpen, playlists, song } = this.props;

    if (!isOpen || this.state == null) {
      return null;
    }

    console.log(song);
    return (
        <Dialog className={classes.dialog} open={true} onClose={this.onClose} 
          PaperProps={{ style: { minWidth: '35vw' } }}>
          <DialogContent>
            <IconButton className={classes.closeButton} aria-label='close' onClick={this.onClose}>
              <CloseIcon className={classes.closeButtonSvg} />
            </IconButton>
            <div className={classes.contentHeader}>
              <img className={classes.songImage} src={verifyImageUrl(song)} alt={song.name}/>
              <div className={classes.songDescription}>
                <Typography className={[classes.songTitle, classes.ellipsisText].join(' ')} variant='h1'>
                  {song.name}
                </Typography>
                <Typography className={[classes.songArtist, classes.ellipsisText].join(' ')} variant='h2'>
                  {song.artist}
                </Typography>
                <div className={classes.playDiv}>
                  <Typography className={classes.playLabel} variant='body1'>
                    Play Sample
                  </Typography>
                  <PlaybackMenu 
                    playTrack={this.playTrack}
                    pauseTrack={this.pauseTrack}
                    resumeTrack={this.resumeTrack}
                    songStarted={this.state.songStarted}
                    songPaused={this.state.songPaused}
                    onVolumeChange={this.onVolumeChange} />
                </div>
              </div>
            </div>
            <div className={classes.timespanDescription}>
              <div className={classes.timespanSection}>
                <Typography className={classes.timespanHeader} variant='h6'>
                  First Added
                </Typography>
                <Typography className={classes.timespanValue} variant='body1'>
                  October 2021
                </Typography>
              </div>
              <div className={classes.timespanSection}>
                <Typography className={classes.timespanHeader} variant='h6'>
                  Removed
                </Typography>
                <Typography className={classes.timespanValue} variant='body1'>
                  December 2021
                </Typography>
              </div>
            </div>
            <div className={classes.timespanResultDiv}>
              <Typography className={classes.timespanValue} variant='body1'>
                You listened to this song for 2 months
              </Typography>
            </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(SongInfoDialog);