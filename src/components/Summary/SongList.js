import React, { Component } from 'react';
import {
  Typography,
  withStyles
} from '@material-ui/core';
import { isSongNew } from '../../utils/helpers';
import { SHARED_STYLES } from '../../utils/sharedStyles';


const styles = () => ({
  ellipsisText: {
    margin: '0 0.5vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  newLabel: {
    backgroundColor: 'red',
    borderRadius: '1vw',
    position: 'absolute',
    right: '0.5vw',
    textAlign: 'center',
    top: '0.75vh',
    width: '25%',
  },
  newLabelText: {
    color: 'white',
    fontSize: SHARED_STYLES.FONT_SIZE_SMALL,
    userSelect: 'none',
  },
  songArtist: {
    fontSize: SHARED_STYLES.FONT_SIZE_MED,
  },
  songItemDescription: {
    backgroundColor: SHARED_STYLES.OVERLAY_COLOR,
    borderRadius: '0 0 ' + SHARED_STYLES.LIST_BORDER_RADIUS + ' ' + SHARED_STYLES.LIST_BORDER_RADIUS,
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
    padding: '1vh 0 0 0',
    transform: 'translateZ(0)',
    whiteSpace: 'nowrap',
  },
  songListImage: {
    borderRadius: SHARED_STYLES.LIST_BORDER_RADIUS,
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
    display: 'inline-flex',
    margin: '0',
    padding: '0 0 ' + SHARED_STYLES.LIST_ITEM_SIZE + ' 0',
    position: 'relative',
    width: SHARED_STYLES.LIST_ITEM_SIZE,
  },
  songTitle: {
    fontSize: SHARED_STYLES.FONT_SIZE_XLARGE,
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