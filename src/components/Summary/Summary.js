import React, { Component } from "react";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
  withStyles,
  withTheme
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { ReactComponent as Hamburger } from "../../hamburger.svg";
import Header from "../Header";
import ColoredLine from "../ColoredLine";
import ChangesComponent from "../ChangesComponent/ChangesComponent";
import { copyAndRemoveItem } from "../../utils/helpers";

const styles = () => ({
  body: {
    display: 'flex'
  },
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
    margin: '4px 4px 4px 4px',
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
  invisible: {
    display: 'none',
  },
  songArtist: {
    color: 'white',
    fontWeight: 'bold',
  },
  songList: {
    background: '#e5ecf7',
    borderRadius: '10px',
    flexWrap: 'nowrap',
    // overrides ImageList inline style
    margin: '5px 20px !important',
    padding: '15px 10px 0px 10px',
    transform: 'translateZ(0)',
  },
  songListImage: {
    borderRadius: '10px',
    height: '200px',
    width: '200px',
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
    this.firebaseController = this.props.firebaseController;
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

  /**
   * Event handler that starts when the user starts dragging a song
   */
  onDragStart = (event, index) => {
    let row = this.refs.tableRow;
    let parentNode = event.target.parentNode.parentNode;
    this.draggedItem = this.state.songs[this.props.selected][index];
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', parentNode);
    // TODO: figure out the correct offset for every screen size
    event.dataTransfer.setDragImage(parentNode, row.offsetWidth - 38, 0);
  };

  /**
   * Event handler for when a song is in the process of being reordered
   */
  onDragOver = index => {
    let songArray = this.state.songs;
    const monthlySongs = songArray[this.props.selected];
    const draggedOverItem = monthlySongs[index];

    // if the dragged item isn't a song or it's dragging over itself, ignore
    if (!this.draggedItem || this.draggedItem === draggedOverItem) {
      return;
    }
    // filter out the currently dragged item
    let updatedSongs = monthlySongs.filter(item => item !== this.draggedItem);
    // add the dragged item after the dragged over item
    updatedSongs.splice(index, 0, this.draggedItem);
    songArray[this.props.selected] = updatedSongs;
    this.setState({
      songs: songArray
    });
  };

  /**
   * Event handler for when the user is done reordering a song
   */
  onDragEnd = () => {
    this.draggedIndex = null;
  };

  toggleRankingEdits = (playlistName, index) => {
    let toggled = this.state.rankingEditsToggled;
    // just untoggled / saved
    if (toggled) {
      this.firebaseController.saveRankings(
        playlistName,
        this.state.songs[index]
      );
    }

    this.setState({
      rankingEditsToggled: !toggled
    });
  };

  render() {
    const { classes, playlist, songs } = this.props;

    console.log(songs);
    if (!playlist) {
      return null;
    } else {
      return (
        <div className={classes.flexVert}>
          <Typography className={classes.songListTitle} variant='h2'>
            {playlist.name} Songs
          </Typography>
          <div>
            <ImageList className={classes.songList}>
              {songs.map((song) => (
                <ImageListItem className={classes.imageListItem} key={song.id}>
                  {song.image ?
                    <img className={classes.songListImage}
                      src={song.image.url} alt={song.name} /> :
                    <img className={classes.songListImage}
                      src="/images/sound_file.png" alt="No image"/>}
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
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(Summary);
