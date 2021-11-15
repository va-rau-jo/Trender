import React, { Component } from "react";
import {
  ImageList,
  ImageListItem,
  Paper,
  Typography,
  withStyles,
} from "@material-ui/core";

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
    height: 'auto !important',
    margin: '0 5px',
    padding: '0 !important',
    width: 'auto !important',
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
    borderRadius: '10px',
    height: '200px',
    width: '200px',
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
    backgroundColor: '#000000CC',
    bottom: '4px',
    borderRadius: '0 0 10px 10px',
    height: '65px',
    position: 'absolute',
    textAlign: 'center',
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
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  /**
   * Updates the state compareIndex variable with the selected value
  */
  handleSelectChange(event) {
    this.setState({
      compareIndex: event.target.value
    });
  }

  isSongNew(song, songList) {
    if (!songList) {
      return false;
    }

    for (let i = 0; i < songList.length; i++) {
      if (song.name === songList[i].name &&
        song.artist === songList[i].artist) {
        return false;
      }
    }
    return true;
  }

  render() {
    const { classes, compareSongs, playlist, songs } = this.props;

    if (!playlist) {
      return null;
    } else {
      const removals = [];
      if (compareSongs) {
        compareSongs.forEach((song) => {
          if (this.isSongNew(song, songs)) {
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
            <ImageList className={classes.songList}>
              {songs.slice(0).reverse().map((song) => (
                <ImageListItem className={classes.imageListItem} key={song.id}>
                  {song.image ?
                    <img className={classes.songListImage}
                      src={song.image.url} alt={song.name} /> :
                    <img className={classes.songListImage}
                      src="/images/sound_file.png" alt="N/A" />}
                  {this.isSongNew(song, compareSongs) ?
                    <div className={classes.newLabel}>
                      <Typography className={classes.newLabelText}
                        variant='subtitle2'>
                          NEW
                      </Typography>
                    </div> : null}
                  <div className={classes.songItemDescription}>
                    <Typography className={[classes.songTitle, classes.ellipsisText].join(' ')}
                      variant='h6'>
                      {song.name}
                    </Typography>
                    <Typography className={[classes.songArtist, classes.ellipsisText].join(' ')} variant='subtitle2'>
                      {song.artist}
                    </Typography>
                  </div>
                </ImageListItem>
              ))}
            </ImageList>
          </Paper>

          {compareSongs ?
            <>
              <Typography className={classes.songListTitle} variant='h2'>
                Removals
              </Typography>
              <Paper elevation={3} className={classes.songListPaper}>
                <ImageList className={classes.songList}>
                  {removals.map((song) => (
                    <ImageListItem className={classes.imageListItem} key={song.id}>
                      {song.image ?
                        <img className={classes.songListImage} src={song.image.url} alt={song.name} /> :
                        <img className={classes.songListImage} src="/images/sound_file.png" alt="Missing file"/>}
                      <div className={classes.songItemDescription}
                        title={song.name}
                        subtitle={song.artist}>
                        <Typography className={[classes.songTitle, classes.ellipsisText].join(' ')}
                          variant='h6'>
                          {song.name}
                        </Typography>
                        <Typography className={[classes.songArtist, classes.ellipsisText].join(' ')} variant='subtitle2'>
                          {song.artist}
                        </Typography>
                      </div>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
            </> : null}
        </div>
      );
    }
  }
}

export default withStyles(styles)(Summary);
