import React, { Component } from 'react';
import {
  Typography,
  withStyles
} from '@material-ui/core';
import { Slider } from '@mui/material';

import { SHARED_STYLES } from '../../utils/sharedStyles';

import imagePause from '../../images/pause.png';
import imagePlay from '../../images/play.png';
import imageVolumeDown from '../../images/volume_down.png';
import imageVolumeUp from '../../images/volume_up.png';

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
    display: 'flex',
    height: 'fit-content',
    marginTop: '2vh',
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
    height: '0.5vh',
    padding: '0.5vh 0 0 0',
    '& .MuiSlider-thumb': {
      height: '1.5vh',
      width: '1.5vh',
    },
    // Fix clipping issue
    '& .MuiSlider-thumb:after': {
      content: 'none'
    },
    '& .MuiSlider-thumb:before': {
      content: 'none'
    },
    '& .MuiSlider-track': {
      borderWidth: '0.15vh'
    },
    '& .MuiSlider-rail': {
      opacity: 0.28,
    },
  },
  volumeSlider: {
    color: '#111111',
    height: '0.5vh',
    padding: 0,
    '& .MuiSlider-thumb': {
      height: '1.2vh',
      width: '1.2vh',
    },
    // Fix clipping issue
    '& .MuiSlider-thumb:after': {
      content: 'none'
    },
    '& .MuiSlider-thumb:before': {
      content: 'none'
    },
    '& .MuiSlider-track': {
      borderWidth: '0.15vh'
    },
    '& .MuiSlider-rail': {
      opacity: 0.28,
    },
  },
};

class PlaybackMenu extends Component {
  /**
   * Given a progress value between 0-100 and the duration of the song
   * returns the minute:seconds of the current position.
   * @param {number} progress A position in the song.
   * @param {number} duration The duration of the song in seconds. 
   * @returns {string} A string label such as 0:00 or 2:49.
   */
  getTimeLabel = (progress, duration) => {
    const time = duration * (progress / 100);
    const min = Math.floor(parseFloat(time) / 60);
    const seconds = Math.round(parseFloat(time) % 60);
    return min + ':' + (seconds + '').padStart(2, '0');
  }

  /**
   * Given the number of seconds into the song, returns the 
   * progress value between 0-100. Needed for the progress bar.
   * @param {number} progress Progress in the song in seconds. 
   * @returns {number} The progress between 0-100.
   */
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
              <img alt='play' className={classes.playButton} src={imagePlay} onClick={playSong} /> :
            songStarted && !songPaused ? 
              <img alt='pause' className={classes.playButton} src={imagePause} onClick={toggleSong} /> : 
            songStarted && songPaused ? 
              <img alt='resume' className={classes.playButton} src={imagePlay} onClick={toggleSong} /> : 
            null}
          </div>

          <Typography className={classes.timeLabel} variant='body2'>
            {this.getTimeLabel(100, song.duration)}            
          </Typography>
        </div>
        <div className={classes.volumeContainer}>
          <img alt='volume down' className={classes.volumeIcon} src={imageVolumeDown} />
          <div className={classes.volumeSlider}>
            <Slider sx={overrides.volumeSlider} value={volume * 100} onChange={onVolumeChange} />
          </div>
          <img alt='volume up' className={classes.volumeIcon} src={imageVolumeUp} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PlaybackMenu);