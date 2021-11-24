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

const styles = () => ({
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
  volumeSlider: {
    height: '3vh'
  }
});


class PlaybackMenu extends Component {

  onVolumeChange = (event) => {
    this.onVolumeChange(event, document.getElementById('volume').value);
  }

  render() {
    const { classes, playTrack, pauseTrack, resumeTrack, songStarted, songPaused, volume } = this.props;

    return (
      <div>
        {!songStarted ? 
            <img className={classes.playButton} src={'images/play.png'} onClick={playTrack} /> :
          songStarted && !songPaused ? 
            <img className={classes.playButton} src={'images/pause.png'} onClick={pauseTrack} /> : 
          songStarted && songPaused ? 
            <img className={classes.playButton} src={'images/play.png'} onClick={resumeTrack} /> : 
          null}
        <Slider id='volume' value={volume} onChange={e => this.onVolumeChange(e)} />

      </div>
    );
  }
}

export default withStyles(styles)(PlaybackMenu);