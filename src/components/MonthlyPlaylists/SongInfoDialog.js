import React, { Component } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  withStyles
} from '@material-ui/core';

import { formatReadableDate, getListenTime, verifyImageUrl } from '../../utils/helpers';
import { SHARED_STYLES } from '../../utils/sharedStyles';
import PlaybackMenu from './PlaybackMenu';
import SpotifyPlaybackManager from '../../utils/Spotify/SpotifyPlaybackManager';

import imageClose from '../../images/close.png';

const styles = () => ({
  analysisDiv: {
    backgroundColor: '#EEEEEE',
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1vh',
    padding: '0 1vw 1vh 1vw'
  },
  contentHeader: {
    display: 'flex',
  },
  closeButton: {
    borderRadius: SHARED_STYLES.BORDER_RADIUS_CIRCLE,
    cursor: 'pointer',
    height: '3vh',
    padding: '0.5vh 0.4vw',
    position: 'absolute',
    right: '0.5vw',
    top: '0.5vh',
    '&:hover': {
      backgroundColor: SHARED_STYLES.BUTTON_HOVER_COLOR
    },
  },
  dialogContent: {
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    boxShadow: SHARED_STYLES.BOX_SHADOW_SCALED,
    padding: '2vh 4vw !important',
  },
  playDiv: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  songArtist: {
    fontSize: '2.2vh',
    fontWeight: 'bold',
    whiteSpace: 'pre-wrap'
  },
  songDescription: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    justifyContent: 'center',
    marginLeft: '1vw',
    textAlign: 'center',
  },
  songImage: {
    borderRadius: '1vh',
    height: '15vh',
  },
  songTitle: {
    fontSize: '3vh',
    fontWeight: 'bold',
    whiteSpace: 'pre-wrap'
  },
  timespanDescription: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '1vh'
  },
  timespanExplanation: {
    fontSize: SHARED_STYLES.FONT_SIZE_LARGE,
  },
  timespanHeader: {
    color: '#333333',
    fontSize: SHARED_STYLES.FONT_SIZE_LARGE,
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
    fontSize: SHARED_STYLES.FONT_SIZE_XLARGE,
  },
});

class SongInfoDialog extends Component {
  constructor(props) {
    super(props);

    this.state = { progress: 0, volume: 0.1 };
    this.connectToPlayer();
  }

  componentWillUnmount() {
    this.setState({ songPaused: false, songStarted: false });
    this.props.spotifyPlayer.removeListener('ready');
    this.props.spotifyPlayer.removeListener('not_ready');
  }

  /**
   * Spotify web player function that connects to a Spotify playback device.
   * Stores the device id for later usage.
   */
  connectToPlayer = () => {
    this.props.spotifyPlayer.addListener('ready', ({ device_id }) => {
      this.setState({
        loadingState: 'spotify player ready',
        spotifyDeviceId: device_id,
        spotifyPlayerReady: true
      });
      SpotifyPlaybackManager.setDeviceId(device_id);
    });

    this.props.spotifyPlayer.addListener('not_ready', ({device_id}) => {
      this.setState({ error: 'Device id has gone offline ' + device_id });
    });

    this.props.spotifyPlayer.connect()
      .then(_ => {
        if (!this.state.unmounted) {
          this.setState({ loadingState: 'connected to player' });
        }
    });
  }

  /**
   * On dialog close.
   * Pauses the song if it is playing and closes the dialog.
   */
  onClose = () => {
    this.props.spotifyPlayer.pause();
    this.props.spotifyPlayer.seek(0);
    this.props.onClose();
  }

  /**
   * Event handler for when the user seeks on the progress bar manually.
   * Calls the spotify web player's seek method to seek to their position.
   * @param {Event} _ The event variable, not needed.
   * @param {number} progress The progress of the progress bar (0-100) The
   * stored progress in the state is the raw seconds in the song.
   */
  onProgressChange = (_, progress) => {
    progress = this.props.song.duration * (progress / 100);
    if (progress !== this.state.progress) {
      this.setState({songProgress: progress});
      this.props.spotifyPlayer.seek(progress * 1000);
    }
  }

  /**
   * Event handler for when the user changes the volume bar.
   * Calls the spotify web player's setVolume method.
   * @param {Event} _ The event variable, not needed.
   * @param {number} volume The volume on the progress bar (0-100). The
   * stored volume in the state is 0-1.
   */
   onVolumeChange = (_, volume) => {
    volume = volume / 100;
    if (volume !== this.state.volume) {
      this.setState({volume: volume});
      this.props.spotifyPlayer.setVolume(volume);
    }
  }

  /**
   * Spotify web player function that will start playing the current song. Also
   * uses the current song progress so we can start in the middle of a song if
   * needed.
   */
  playSong = () => {
    SpotifyPlaybackManager.playSong(this.props.song.uri, this.state.songProgress * 1000)
      .then(async res => {
        if (res.status === 403) {
          this.setState({ error: 'Spotify Premium is required to play songs' });
        } else {
          this.setState({
            songPaused: false,
            songProgress: !this.state.songProgress ? 0 : this.state.songProgress,
            songStarted: true,
          });
          this.startProgressInterval();
        }
    }).catch((error) => {
        this.setState({loadingState: 'playback error: ' + error});
    })
  };

  /**
   * While a song is playing, this interval is started so the progress
   * bar moves while the song plays. On pause, this should be cleared.
   */
  startProgressInterval = () => {
    this.setState({ songProgressInterval: setInterval(() => {
      this.props.spotifyPlayer.getCurrentState().then(res => {
        if (res) {
          if (res.position === 0) {
            this.setState({
              songPaused: false,
              songStarted: false
            });
          }
          this.setState({ songProgress: res.position / 1000 });
        }
      })
    }, 1000)})
  }

  /**
   * Stops the progress interval so the progress bar stops moving
   * when a song is paused or clicked away from.
   */
  stopProgressInterval = () => {
    clearInterval(this.state.songProgressInterval);
  }

  /**
   * Spotify web player function that toggles between paused and resumed.
   */
  toggleSong = () => {
    if (this.state.songStarted) {
      if (this.state.songPaused) {
        this.startProgressInterval();
      } else {
        this.stopProgressInterval();
      }
      this.props.spotifyPlayer.togglePlay();
      this.setState({songPaused: !this.state.songPaused});
    }
  }

  render() {
    const { classes, isOpen, song, songFirstAdded, songRemoved } = this.props;

    if (!isOpen || this.state == null) {
      return null;
    }

    const artistText = song.artist === '' ? 'Unknown artist' : song.artist;
    const listenTime = getListenTime(songFirstAdded, songRemoved);

    return (
        <Dialog open={true} onClose={this.onClose}
          PaperProps={{ style: { maxWidth: '60vw', minWidth: '35vw' } }}>
          <DialogContent className={classes.dialogContent}>
            <img alt='close' className={classes.closeButton} src={imageClose} onClick={this.onClose} />
            <div className={classes.contentHeader}>
              <img className={classes.songImage} src={verifyImageUrl(song)} alt={song.name}/>
              <div className={classes.songDescription}>
                <Typography className={classes.songTitle} variant='h1'>
                  {song.name}
                </Typography>
                <Typography className={classes.songArtist} variant='h2'>
                  {artistText}
                </Typography>
              </div>
            </div>
            {song.id ?
              <div className={classes.playDiv}>
                <PlaybackMenu
                  onProgressChange={this.onProgressChange}
                  onVolumeChange={this.onVolumeChange}
                  playSong={this.playSong}
                  songPaused={this.state.songPaused}
                  songProgress={this.state.songProgress ?? 0}
                  songStarted={this.state.songStarted}
                  toggleSong={this.toggleSong}
                  song={song}
                  volume={this.state.volume ?? 0}/>
              </div> : null }
            <div className={classes.analysisDiv}>
              <div className={classes.timespanDescription}>
                <div className={classes.timespanSection}>
                  <Typography className={classes.timespanHeader} variant='h6'>
                    First Added
                  </Typography>
                  <Typography className={classes.timespanValue} variant='body1'>
                    {formatReadableDate(songFirstAdded)}
                  </Typography>
                </div>
                {songRemoved ?
                  <div className={classes.timespanSection}>
                    <Typography className={classes.timespanHeader} variant='h6'>
                      Removed
                    </Typography>
                    <Typography className={classes.timespanValue} variant='body1'>
                      {songRemoved}
                    </Typography>
                  </div> : null}
              </div>
              <div className={classes.timespanResultDiv}>
                <Typography className={classes.timespanExplanation} variant='body1'>
                  You {!songRemoved ? 'have' : ''} listened to this song for
                  {' '}{listenTime}{' '}
                  months!
                </Typography>
              </div>
            </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(SongInfoDialog);