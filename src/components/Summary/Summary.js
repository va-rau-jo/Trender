import React, { Component } from "react";
import {
  ImageList,
  ImageListItem,
  Paper,
  Typography,
  withStyles,
} from "@material-ui/core";
import SongList from './SongList';
import { isSongNew } from '../../utils/helpers';
import PlaylistList from '../Manager/PlaylistList';

const styles = () => ({
  ellipsisText: {
    margin: '0 5px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  flexVert: {
    display: 'flex',
    flexDirection: 'column',
  },
  hamburger: {
    cursor: 'pointer',
    float: 'left',
    height: '16px',
    margin: '4px',
    width: '16px'
  },
  // ImageList randomly sets inline style for padding, width, and height, so we
  // need important to override it.
  imageListItem: {
    // height: 'auto !important',
    // margin: '0 5px',
    // padding: '0 !important',
    // width: 'auto !important',
    border: '0.75vh solid white',
    borderRadius: '1px',
    color: 'white',
    cursor: 'pointer',
    margin: '0.5vh 1vw',
    // Height set to 0 and padding-bottom set to width to keep the list items square
    height: '0 !important',
    padding: '0 0 20% 0 !important',
    position: 'relative',
    width: '20% !important',
  },
  newLabel: {
    backgroundColor: 'red',
    borderRadius: '10px',
    position: 'absolute',
    right: '4px',
    textAlign: 'center',
    top: '5px',
    width: '25%',
  },
  newLabelText: {
    color: 'white',
    userSelect: 'none',
  },
  noSongLabel: {
    padding: '10px 0',
  },
  songArtist: {
    color: 'white',
    fontWeight: 'bold',
  },
  songList: {
    background: 'white',
    borderRadius: '10px',
    flexWrap: 'nowrap',
    // overrides ImageList inline style
    margin: '5px 20px !important',
    paddingTop: '15px',
    transform: 'translateZ(0)',
  },
  songListImage: {
    // borderRadius: '10px',
    // height: '200px',
    // width: '200px',
    borderRadius: '1px',
    height: '100%',
    left: '0',
    position: 'absolute',
    top: '0',
    userSelect: 'none',
    width: '100%',
  },
  songListPaper: {
    margin: '0 15px'
  },
  songListTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '16px 0',
  },
  songItemDescription: {
    // backgroundColor: '#000000CC',
    // bottom: '4px',
    // borderRadius: '0 0 10px 10px',
    // height: '65px',
    // position: 'absolute',
    // textAlign: 'center',
    // width: '100%',
    backgroundColor: '#000000CC',
    borderRadius: '0 0 1px 1px',
    bottom: '0',
    display: 'flex',
    flexDirection: 'column',
    height: '25%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  songTitle: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '5px',
  },
});

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compareIndex: 0,
      // Array with the song objects of each monthly playlist
      songs: props.songs
    };
  }


  render() {
    const { classes, songsToCompare, playlist, songs } = this.props;

    if (!playlist) {
      return null;
    } else {
      const removals = [];
      if (songsToCompare) {
        songsToCompare.forEach((song) => {
          if (isSongNew(song, songs)) {
            removals.push(song);
          }
        });
      }

      return (
        <div className={classes.flexVert}>
          <Typography className={classes.songListTitle} variant='h2'>
            {playlist.name} Songs
          </Typography>
          <Paper elevation={3} className={classes.songListPaper}>
            {songs.length === 0 ?
              <div>
                <Typography className={classes.noSongLabel} variant='h6'>
                  No songs in playlist
                </Typography>
              </div> :
              <SongList songs={songs} songsToCompare={songsToCompare} />
            }
          </Paper>

          {songsToCompare ?
            <>
              <Typography className={classes.songListTitle} variant='h2'>
                Removals
              </Typography>
              <Paper elevation={3} className={classes.songListPaper}>
                {songs.length === 0 ?
                  <div>
                    <Typography className={classes.noSongLabel} variant='h6'>
                      No songs in playlist
                    </Typography>
                  </div> :
                  <SongList songs={removals} />
                }
              </Paper>
            </> : null}
        </div>
      );
    }
  }
}

export default withStyles(styles)(Summary);
