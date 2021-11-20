import React, { Component } from 'react';
import {
  Typography,
  withStyles
} from '@material-ui/core';
import { isSongNew } from '../../utils/helpers';

const BORDER_RADIUS = '1vh';
const OVERLAY_COLOR = '#000000CC';

const styles = () => ({
  // The MaterialUI ImageList component sets inline style for padding,
  // width, and height, so we need important to override it.
  ellipsisText: {
    margin: '0 5px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  songArtist: {
    fontSize: '1.7vh',
  },
  songItemDescription: {
    backgroundColor: OVERLAY_COLOR,
    borderRadius: '0 0 ' + BORDER_RADIUS + ' ' + BORDER_RADIUS,
    bottom: '0',
    display: 'flex',
    flexDirection: 'column',
    height: '25%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  songList: {
    margin: '0 1vw',
    overflowX: 'scroll',
    padding: '0',
    transform: 'translateZ(0)',
    whiteSpace: 'nowrap',
  },
  songListImage: {
    borderRadius: BORDER_RADIUS,
    height: '100%',
    left: '0',
    position: 'absolute',
    top: '0',
    userSelect: 'none',
    width: '100%',
  },
  songListItem: {
    border: '0.75vh solid white',
    color: 'white',
    display: 'inline-table',
    margin: '0',
    padding: '0 0 22vh 0',
    position: 'relative',
    width: '22vh',
  },
  songTitle: {
    fontSize: '2vh',
  },
});

class SongList extends Component {
  render() {
    const { classes, songs, songsToCompare } = this.props;
    const shouldDisplayNewLabel = songsToCompare !== undefined;

    return (
      <ul className={classes.songList}>
        {songs.map((song) => (
          <div className={classes.songListItem} key={song.id}>
            {song.image ?
              <img className={classes.songListImage} src={song.image.url} alt={song.name} /> :
              <img className={classes.songListImage} src="/images/sound_file.png" alt="Missing file" />}
             {shouldDisplayNewLabel && isSongNew(song, songsToCompare) ?
                <div className={classes.newLabel}>
                  <Typography className={classes.newLabelText} variant='subtitle2'>
                    NEW
                  </Typography>
                </div> : null}
            <div className={classes.songItemDescription} title={song.name} subtitle={song.artist}>
              <Typography className={[classes.songTitle, classes.ellipsisText].join(' ')} variant='body2'>
                {song.name}
              </Typography>
              <Typography className={[classes.songArtist, classes.ellipsisText].join(' ')} variant='body2'>
                {song.artist}
              </Typography>
            </div>
          </div>
        ))}
      </ul>
    );
  }
}

export default withStyles(styles)(SongList);