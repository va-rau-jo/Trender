import React, { Component } from 'react';
import {
  Button,
  Checkbox,
  ImageList,
  ImageListItem,
  ListSubheader,
  Typography,
  withStyles
} from '@material-ui/core';

const styles = () => ({

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

    const { classes, togglePlaylist, playlists, selectedPlaylists, visiblePlaylists } = this.props;  
 
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