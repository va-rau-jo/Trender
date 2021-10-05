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
    height: '65px',
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
  listItemText: {
    color: 'white',
  },
  playlistList: {
    background: 'white',
    // borderRadius: '10px',
    justifyContent: 'space-evenly',
    // overrides ImageList inline style
    margin: '0px 20px !important',
    // padding: '20px',
    transform: 'translateZ(0)',
  },
  playlistListImage: {
    borderRadius: '10px',
  },
  // Overriding default inline style for ListItem
  playlistListItem: {
    border: '4px solid white',
    borderRadius: '16px',
    cursor: 'pointer',
    height: '250px !important',
    margin: '5px',
    padding: '0px !important',
    width: '250px !important',
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

    const { classes, playlists, selectedPlaylists, togglePlaylist, visiblePlaylists } = this.props;

    return (
      <ImageList className={classes.playlistList}>
        <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader className={classes.subheader} component="div">
                Playlists
            </ListSubheader>
        </ImageListItem>
        {playlists.map((playlist) => {
            const visible = visiblePlaylists.indexOf(playlist.id) > -1;
            const selected = selectedPlaylists.indexOf(playlist.id) > -1;
            if (visible) {
                return (
                  <ImageListItem cols={2} key={playlist.id} onClick={() => { togglePlaylist(playlist) }}
                      className={classes.playlistListItem + ' ' + (selected ? classes.selectedListItem : '')}>
                      <img className={classes.playlistListImage} alt="Playlist"
                      src={playlist.images[0] ? playlist.images[0].url : "/images/sound_file.png"} />
                      {selected ?
                      <div className={classes.listItemIndexDiv}>
                          <Typography className={classes.listItemIndex} variant='h6'>
                          {(selectedPlaylists.indexOf(playlist.id) + 1)}
                          </Typography>
                      </div> : null}

                      <div className={classes.listItemDescription}>
                          <Typography className={classes.listItemText} variant='h6'>
                              {playlist.name}
                          </Typography>
                          <Typography className={classes.listItemText} variant='subtitle1'>
                              {playlist.tracks.total} Songs
                          </Typography>
                          <HiddenCheckbox id={playlist.id + 'checkbox'} checked={selected}
                              className={classes.listCheckbox} />
                      </div>
                  </ImageListItem>
                );
            }
        })}
      </ImageList>
    );
  }
}

export default withStyles(styles)(PlaylistList);