import React, { Component } from 'react';
import {
  ImageList,
  ImageListItem,
  ListSubheader,
  Typography,
  withStyles
} from '@material-ui/core';
import { SHARED_STYLES } from '../../utils/sharedStyles';

import imageSoundFile from '../../images/sound_file_white.png';

const styles = () => ({
  ellipsisText: {
    margin: SHARED_STYLES.OVERLAY_TEXT_MARGIN,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  listItemDescription: {
    backgroundColor: SHARED_STYLES.OVERLAY_COLOR,
    borderRadius: '0 0 ' + SHARED_STYLES.LIST_ITEM_BORDER_RADIUS + ' ' + SHARED_STYLES.LIST_ITEM_BORDER_RADIUS,
    bottom: '0',
    display: 'flex',
    flexDirection: 'column',
    height: '25%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  listItemIndexDiv: {
    backgroundColor: SHARED_STYLES.OVERLAY_COLOR,
    borderRadius: SHARED_STYLES.BORDER_RADIUS_CIRCLE,
    padding: '0 0.7vw',
    position: 'absolute',
    right: '0.5vw',
    top: '0.5vh',
    userSelect: 'none',
  },
  listItemIndex: {
    fontSize: SHARED_STYLES.FONT_SIZE_XLARGE,
  },
  listItemSubtitle: {
    fontSize: SHARED_STYLES.FONT_SIZE_MED,
  },
  listItemText: {
    fontSize: SHARED_STYLES.FONT_SIZE_XLARGE,
  },
  noPlaylistsMessage: {
    fontSize: SHARED_STYLES.FONT_SIZE_HEADER,
  },
  playlistList: {
    justifyContent: 'space-evenly',
    margin: '0 !important',
    transform: 'translateZ(0)',
  },
  playlistListImage: {
    borderRadius: SHARED_STYLES.LIST_ITEM_BORDER_RADIUS,
    height: '100%',
    left: '0',
    position: 'absolute',
    top: '0',
    userSelect: 'none',
    width: '100%',
  },
  // Overriding default inline style for ListItem
  playlistListItem: {
    border: '0.75vh solid white',
    color: 'white',
    cursor: 'pointer',
    margin: '0.5vh 1vw',
    // Height set to 0 and padding-bottom set to width to keep the list items square
    height: '0 !important',
    padding: '0 0 ' + SHARED_STYLES.LIST_ITEM_SIZE + ' !important',
    position: 'relative',
    width: SHARED_STYLES.LIST_ITEM_SIZE + ' !important',
  },
  playlistListItemHeader: {
    // !important needed to override ImageListItem styling
    alignItems: 'center',
    display: 'flex',
    fontSize: '3vh',
    justifyContent: 'center',
    height: '6vh !important',
    padding: '0.2vh 0.2vw !important',
  },
  selectedListItem: {
    backgroundColor: SHARED_STYLES.SELECT_BORDER_COLOR,
    border: '0.75vh solid ' + SHARED_STYLES.SELECT_BORDER_COLOR,
    borderRadius: '2vh'
  },
});

class PlaylistList extends Component {
  render() {
    const { classes, playlists, selectedIndices, togglePlaylist, visibleIndices } = this.props;
    return (
      <ImageList className={classes.playlistList}>
        <ImageListItem cols={2} className={classes.playlistListItemHeader} key='Subheader'>
          <ListSubheader className={classes.playlistListItemHeader} component='div'>
              Playlists
          </ListSubheader>
        </ImageListItem>
        {visibleIndices.length === 0 ? 
          <Typography className={classes.noPlaylistsMessage} variant='body1'>
            No playlists found
          </Typography>

         : 
         visibleIndices.map(i => {
          const playlist = playlists[i];
          const selected = selectedIndices.includes(i);
          return (
            <div key={i} onClick={() => { togglePlaylist(i) }}
              className={classes.playlistListItem + ' ' + (selected ? classes.selectedListItem : '')}>
              <img className={classes.playlistListImage} alt='Playlist'
                src={playlist.images[0] ? playlist.images[0].url : imageSoundFile } />
              {selected ?
                <div className={classes.listItemIndexDiv}>
                  <Typography className={classes.listItemIndex} variant='h6'>
                    {(selectedIndices.indexOf(i) + 1)}
                  </Typography>
                </div>
                : null}
              <div className={classes.listItemDescription}>
                <Typography className={[classes.listItemText, classes.ellipsisText].join(' ')} variant='body1'>
                    {playlist.name}
                </Typography>
                <Typography className={[classes.listItemSubtitle, classes.ellipsisText].join(' ')} variant='body2'>
                    {playlist.tracks.total} Songs
                </Typography>
              </div>
            </div>
          );
        })}
      </ImageList>
    );
  }
}

export default withStyles(styles)(PlaylistList);