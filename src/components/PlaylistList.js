import React, { Component } from 'react';
import {
  Checkbox,
  ImageList,
  ImageListItem,
  ListSubheader,
  Typography,
  withStyles
} from '@material-ui/core';

const styles = () => ({
  listCheckbox: {
    bottom: '0',
    position: 'absolute',
    right: '5px',
    top: '0',
  },
  listItemDescription: {
    backgroundColor: '#000000CC',
    borderRadius: '0 0 10px 10px',
    bottom: '0',
    color: 'white',
    height: '30%',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
  },
  listItemIndexDiv: {
    position: 'absolute',
    right: '5px',
    top: '5px',
  },
  listItemIndex: {
    backgroundColor: '#000000CC',
    borderRadius: '50%',
    color: 'white',
    padding: '0 8px',
  },
  listItemSubtitle: {
    // fontSize: '14px',
    margin: '0 5px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  listItemText: {
    // fontSize: '18px',
    margin: '2px 5px 0 5px',
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
    borderRadius: '10px',
    height: '100%',
    left: '0',
    position: 'absolute',
    top: '0',
    width: '100%',
  },
  // Overriding default inline style for ListItem
  playlistListItem: {
    border: '4px solid white',
    borderRadius: '16px',
    cursor: 'pointer',
    margin: '5px',
    // Height set to 0 and padding-bottom set to width to keep
    // the list items square
    height: '0 !important',
    padding: '0 0 20% 0 !important',
    position: 'relative',
    userSelect: 'none',
    width: '20% !important',
  },
  selectedListItem: {
    border: '4px solid #ff2d52',
  },
  subheader: {
    fontSize: '20px',
  },
});

// Custom checkbox to be invisible when unchecked but a nice color when checked.
const HiddenCheckbox = withStyles({
  root: {
    color: '#00000000', // invisible
    '&$checked': {
      color: '#ff2d52',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

class PlaylistList extends Component {
  render() {
    const { classes, playlists, selectedIndices, togglePlaylist, visibleIndices } = this.props;
    return (
      <ImageList className={classes.playlistList}>
        <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader className={classes.subheader} component="div">
                Playlists
            </ListSubheader>
        </ImageListItem>
        {visibleIndices.map(i => {
          const playlist = playlists[i];
          const selected = selectedIndices.includes(i);
          return (
            <div cols={2} key={i} onClick={() => { togglePlaylist(i) }}
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