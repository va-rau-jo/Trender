import React, { Component } from "react";
import { Button, Typography, withStyles } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import styles from "./styles";
import { ReactComponent as Hamburger } from "../../hamburger.svg";
import Header from "../Header";
import ColoredLine from "../ColoredLine";
import ChangesComponent from "../ChangesComponent/ChangesComponent";
import { copyAndRemoveItem } from "../../utils/helpers";

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
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", parentNode);
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
    let rankingEditsToggled = this.state.rankingEditsToggled;
    let cIndex = this.state.compareIndex;

    console.log(playlist);
    console.log(songs);

    if (!playlist) {
      return null;
    } else {
      return (
        // <div className={classes.page}>
        //   <Header
        //     playlist1={playlists[selected]}
        //     playlist2={copyAndRemoveItem(playlists, selected)[cIndex]}
        //   />
        //   <div className={classes.body}>
            <div className={classes.songListDiv}>
              <div style={{ margin: "0px 20px" }}>
                <ColoredLine color="white" height="1px" />
                <Button
                  variant="contained"
                  // onClick={() =>
                  //   this.toggleRankingEdits(playlists[selected].name, selected)
                  // }
                >
                  {rankingEditsToggled ? "Save" : "Edit"}
                </Button>
              </div>
              <div style={{ display: "flex" }}>
                <Table className={classes.table}>
                  <TableBody>
                    {songs.map((item, index) => (
                      <TableRow
                        ref="tableRow"
                        key={index}
                        onDragOver={() => this.onDragOver(index)}
                        onDragStart={e => this.onDragStart(e, index)}
                        onDragEnd={this.onDragEnd}
                      >
                        <TableCell className={classes.tableCell}>
                          <Typography> {index + 1} </Typography>
                        </TableCell>
                        <TableCell
                          className={classes.tableCellTitle}
                          align="right"
                        >
                          {item.name.length > 22
                            ? item.name.substring(0, 20) + "..."
                            : item.name}
                        </TableCell>
                        <TableCell
                          className={classes.tableCellArtist}
                          align="right"
                        >
                          {item.artists[0].name.length > 22
                            ? item.artists[0].name.substring(0, 20) + "..."
                            : item.artists[0].name}
                        </TableCell>
                        <TableCell className={classes.tableCellEdit}>
                          <div
                            draggable
                            className={
                              !rankingEditsToggled ? classes.invisible : ""
                            }
                          >
                            <Hamburger className={classes.hamburger} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
        //     <div className={classes.selectDiv}>
        //       <div>
        //         <ChangesComponent
        //           compareIndex={cIndex}
        //           playlists={copyAndRemoveItem(playlists, selected)}
        //           songList1={this.state.songs[selected].slice()}
        //           songList2={copyAndRemoveItem(this.state.songs, selected)[
        //             cIndex
        //           ].slice()}
        //           handleSelectChange={this.handleSelectChange}
        //         />
        //       </div>
        //     </div>
        //   </div>
        // </div>
      );
    }
  }
}

export default withStyles(styles)(Summary);
