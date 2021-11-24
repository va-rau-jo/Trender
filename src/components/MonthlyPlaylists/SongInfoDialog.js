import React, { Component } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  withStyles
} from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { verifyImageUrl } from '../../utils/helpers';
import { SHARED_STYLES } from '../../utils/sharedStyles';

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
  }
});

class SongInfoDialog extends Component {

  render() {
    const { classes, isOpen, onClose, playlists, song, spotifyPlayer } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
        <Dialog className={classes.dialog} open={true} onClose={onClose} 
          PaperProps={{ style: { minWidth: '35vw' } }}>
          <DialogContent>
            <IconButton className={classes.closeButton} aria-label="close" onClick={onClose}>
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
                  <img className={classes.playButton} onClick={() => {
                    spotifyPlayer.connect();
                    spotifyPlayer.togglePlay();
                  }} src={'images/play2.png'} />
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