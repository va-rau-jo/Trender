import React, { Component } from 'react';
import {
  Typography,
  withStyles
} from '@material-ui/core';
import { Slider } from '@mui/material';

import { SHARED_STYLES } from '../../utils/sharedStyles';

const styles = () => ({
  buttonContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5vh',
    width: '100%'
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  playButton: {
    borderRadius: SHARED_STYLES.BORDER_RADIUS_CIRCLE,
    cursor: 'pointer',
    padding: '0.3vw',
    width: '3vh',
    '&:hover': {
      backgroundColor: SHARED_STYLES.BUTTON_HOVER_COLOR
    },
  },
  playButtonContainer: {
    display: 'inline-flex'
  },
  playDiv: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  sliderContainer: {
    width: '95%'
  },
  timeLabel: {
    color: '#666666',
    fontSize: SHARED_STYLES.FONT_SIZE_SMALL,
  },
  volumeContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  volumeIcon: {
    height: '2.5vh',
  },
  volumeSlider: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 0.5vw',
    width: '40%'
  }
});

const overrides = {
  progressSlider: {
    height: 3,
    padding: '0.5vh 0 0 0',
    '& .MuiSlider-thumb': {
      height: 8,
      width: 8,
    },
    // Fix clipping issue
    '& .MuiSlider-thumb:after': {
      content: 'none'
    },
    '& .MuiSlider-thumb:before': {
      content: 'none'
    },
    '& .MuiSlider-rail': {
      opacity: 0.28,
    },
  },
  volumeSlider: {
    color: '#111111',
    height: 2,
    padding: 0,
    '& .MuiSlider-thumb': {
      height: 7,
      width: 7,
    },
    // Fix clipping issue
    '& .MuiSlider-thumb:after': {
      content: 'none'
    },
    '& .MuiSlider-thumb:before': {
      content: 'none'
    },
    '& .MuiSlider-rail': {
      opacity: 0.28,
    },
  },
};

class PlaybackMenu extends Component {
  getTimeLabel = (progress, duration) => {
    const time = duration * (progress / 100);
    const min = Math.floor(parseFloat(time) / 60);
    const seconds = Math.round(parseFloat(time) % 60);
    return min + ':' + (seconds + '').padStart(2, '0');
  }

  getProgressBarValue = (progress) => {
    return progress / this.props.song.duration * 100;
  }

  render() {
    const { classes, onProgressChange, onVolumeChange, playSong, songPaused, 
      songProgress, songStarted, toggleSong, song, volume } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.sliderContainer}>
          <Slider sx={overrides.progressSlider} value={this.getProgressBarValue(songProgress)} onChange={onProgressChange} />
        </div>
        <div className={classes.buttonContainer}>
          <Typography className={classes.timeLabel} variant='body2'>
            {this.getTimeLabel(this.getProgressBarValue(songProgress ?? 0), song.duration)}
          </Typography>

          <div className={classes.playButtonContainer}>
            {!songStarted ? 
              <img alt='play' className={classes.playButton} src={'images/play.png'} onClick={playSong} /> :
            songStarted && !songPaused ? 
              <img alt='pause' className={classes.playButton} src={'images/pause.png'} onClick={toggleSong} /> : 
            songStarted && songPaused ? 
              <img alt='resume' className={classes.playButton} src={'images/play.png'} onClick={toggleSong} /> : 
            null}
          </div>

          <Typography className={classes.timeLabel} variant='body2'>
            {this.getTimeLabel(100, song.duration)}            
          </Typography>
        </div>
        <div className={classes.volumeContainer}>
          <img alt='volume down' className={classes.volumeIcon} src={'images/volume_down.png'} />
          <div className={classes.volumeSlider}>
            <Slider sx={overrides.volumeSlider} value={volume * 100} onChange={onVolumeChange} />
          </div>
          <img alt='volume up' className={classes.volumeIcon} src={'images/volume_up.png'} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PlaybackMenu);