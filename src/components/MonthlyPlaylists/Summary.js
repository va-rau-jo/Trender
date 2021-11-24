import React, { Component } from "react";
import {
  Paper,
  Typography,
  withStyles,
} from "@material-ui/core";
import SongList from './SongList';
import { isSongNew } from '../../utils/helpers';
import { SHARED_STYLES } from '../../utils/sharedStyles';

const styles = () => ({
  ellipsisText: {
    margin: SHARED_STYLES.OVERLAY_TEXT_MARGIN,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  flexVert: {
    display: 'flex',
    flexDirection: 'column',
  },
  noSongLabel: {
    padding: '1vh 0',
  },
  songListPaper: {
    margin: '1vh 1.5vw'
  },
  songListTitle: {
    fontSize: SHARED_STYLES.FONT_SIZE_HEADER,
    fontWeight: 'bold',
    marginTop: '1vh',
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
    const { classes, playlist1, songs1, songs2, openSongInfoDialog } = this.props;

    if (!playlist1) {
      return null;
    } else {
      const additions = [];
      const removals = [];
      if (songs2) {
        songs1.forEach((song) => {
          if (isSongNew(song, songs2)) {
            additions.push(song);
          }
        });
        songs2.forEach((song) => {
          if (isSongNew(song, songs1)) {
            removals.push(song);
          }
        });
      }

      return (
        <div className={classes.flexVert}>
          <Paper elevation={3} className={classes.songListPaper}>
            <Typography className={classes.songListTitle} variant='h2'>
              {playlist1.name} Songs
            </Typography>
            {songs1.length === 0 ?
              <div>
                <Typography className={classes.noSongLabel} variant='h6'>
                  No songs in playlist
                </Typography>
              </div> :
              <SongList openDialog={openSongInfoDialog} songs={songs1} songsToCompare={songs2} />
            }
          </Paper>
          {songs2 ?
            <Paper elevation={3} className={classes.songListPaper}>
              <Typography className={classes.songListTitle} variant='h2'>
                Additions
              </Typography>
              <SongList openDialog={openSongInfoDialog} songs={additions} />
            </Paper> : null}
          {songs2 ?
            <Paper elevation={3} className={classes.songListPaper}>
              <Typography className={classes.songListTitle} variant='h2'>
                Removals
              </Typography>
              <SongList openDialog={openSongInfoDialog} songs={removals} />
            </Paper> : null}
        </div>
      );
    }
  }
}

export default withStyles(styles)(Summary);
