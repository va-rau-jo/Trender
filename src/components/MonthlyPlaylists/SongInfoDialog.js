import React, { Component } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  withStyles
} from '@material-ui/core';

import { formatReadableDate, getListenTime, verifyImageUrl } from '../../utils/helpers';
import { SHARED_STYLES } from '../../utils/sharedStyles';
import SpotifyPlaylistManager from '../../utils/Spotify/SpotifyPlaylistManager';
import PlaybackMenu from './PlaybackMenu';
import SpotifyPlaybackManager from '../../utils/Spotify/SpotifyPlaybackManager';

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
  ellipsisText: {
    margin: SHARED_STYLES.OVERLAY_TEXT_MARGIN,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
  songInfo: {
    display: 'flex',    
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
  volumeSlider: {
    height: '3vh'
  }
});

class SongInfoDialog extends Component {
  constructor(props) {
    super(props);

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Trender Spotify Player',
        getOAuthToken: cb => { cb(SpotifyPlaylistManager.getAccessToken()); },
        volume: 0.25
      });

      this.setState({spotifyPlayer: player, volume: 0.25});
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
          SpotifyPlaybackManager.setDeviceId(device_id);
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

  startProgressInterval = () => {
    this.setState({ songProgressInterval: setInterval(() => {
      this.state.spotifyPlayer.getCurrentState().then(res => {
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

  stopProgressInterval = () => {
    clearInterval(this.state.songProgressInterval);
  }

  toggleSong = () => {
    if (this.state.songStarted) {
      if (this.state.songPaused) {
        this.startProgressInterval();
      } else {
        this.stopProgressInterval();
      }
      this.state.spotifyPlayer.togglePlay();
      this.setState({songPaused: !this.state.songPaused});
    }
  }

  onClose = () => {
    this.state.spotifyPlayer.pause();
    this.setState({ songPaused: false, songStarted: false });
    this.props.onClose();
  }

  onProgressChange = (_, progress) => {
    progress = this.props.song.duration * (progress / 100);
    if (progress !== this.state.progress) {
      this.setState({songProgress: progress});
      this.state.spotifyPlayer.seek(progress * 1000);
    }
  }

  onVolumeChange = (_, volume) => {
    volume = volume / 100; // Spotify volume is 0-1
    if (volume !== this.state.volume) {
      this.setState({volume: volume});
      this.state.spotifyPlayer.setVolume(volume);
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
        <Dialog className={classes.dialog} open={true} onClose={this.onClose} 
          PaperProps={{ style: { maxWidth: '60vw', minWidth: '35vw' } }}>
          <DialogContent>
           <img alt='close' className={classes.closeButton} src={'images/close.png'} onClick={this.onClose} />
            <div className={classes.contentHeader}>
              <img className={classes.songImage} src={verifyImageUrl(song)} alt={song.name}/>
              <div className={classes.songDescription}>
                <Typography className={[classes.songTitle, classes.ellipsisText].join(' ')} variant='h1'>
                  {song.name}
                </Typography>
                <Typography className={[classes.songArtist, classes.ellipsisText].join(' ')} variant='h2'>
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