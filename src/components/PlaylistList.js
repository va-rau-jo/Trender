import React, { Component } from 'react';
import {
  ImageList,
  ImageListItem,
  ListSubheader,
  Typography,
  withStyles
} from '@material-ui/core';

const BORDER_RADIUS = '1vh';
const FONT_SIZE_LARGE = '2vh';
const OVERLAY_COLOR = '#000000CC';

const styles = () => ({
  listCheckbox: {
    bottom: '0',
    position: 'absolute',
    right: '5px',
    top: '0',
  },
  listItemDescription: {
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
  listItemIndexDiv: {
    backgroundColor: OVERLAY_COLOR,
    borderRadius: BORDER_RADIUS,
    padding: '0 0.7vw',
    position: 'absolute',
    right: '0.5vw',
    top: '0.5vh',
    userSelect: 'none',
  },
  listItemIndex: {
    fontSize: FONT_SIZE_LARGE,
  },
  listItemSubtitle: {
    fontSize: '1.1vw',
    margin: '0 0.5vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  listItemText: {
    fontSize: '1.3vw',
    margin: '0 0.5vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  playlistList: {
    justifyContent: 'space-evenly',
    margin: '0 !important',
    transform: 'translateZ(0)',
  },
  playlistListImage: {
    borderRadius: BORDER_RADIUS,
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
    borderRadius: BORDER_RADIUS,
    color: 'white',
    cursor: 'pointer',
    margin: '0.5vh 1vw',
    // Height set to 0 and padding-bottom set to width to keep the list items square
    height: '0 !important',
    padding: '0 0 20% 0 !important',
    position: 'relative',
    width: '20% !important',
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
    border: '0.75vh solid #ff2d52',
    borderRadius: '2vh'
  },
});

class PlaylistList extends Component {
  render() {
    const { classes, playlists, selectedIndices, togglePlaylist, visibleIndices } = this.props;
    return (
      <ImageList className={classes.playlistList}>
        <ImageListItem cols={2} className={classes.playlistListItemHeader} key="Subheader">
          <ListSubheader className={classes.playlistListItemHeader} component="div">
              Playlists
          </ListSubheader>
        </ImageListItem>
        {visibleIndices.map(i => {
          const playlist = playlists[i];
          const selected = selectedIndices.includes(i);
          return (
            <div key={i} onClick={() => { togglePlaylist(i) }}
              className={classes.playlistListItem + ' ' + (selected ? classes.selectedListItem : '')}
              sx={{height: 0}} >

              <img className={classes.playlistListImage} alt="Playlist"
                src={playlist.images[0] ? playlist.images[0].url : "/images/sound_file.png"} />

              {selected ?
                <div className={classes.listItemIndexDiv}>
                  <Typography className={classes.listItemIndex} variant='h6'>
                    {(selectedIndices.indexOf(i) + 1)}
                  </Typography>
                </div>
                : null}

              <div className={classes.listItemDescription}>
                <Typography className={classes.listItemText} variant='body1'>
                    {playlist.name}
                </Typography>
                <Typography className={classes.listItemSubtitle} variant='body2'>
                    {playlist.tracks.total} Songs
                </Typography>
                {/* <HiddenCheckbox id={playlist.id + 'checkbox'} checked={selected}
                    className={classes.listCheckbox} /> */}
              </div>
            </div>
          );
        })}
      </ImageList>
    );
  }
}

export default withStyles(styles)(PlaylistList);