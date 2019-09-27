import React, { Component } from "react";
import { Button, MenuItem, Typography, withStyles } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { ReactComponent as Hamburger } from "../hamburger.svg";
import Header from "./Header";
import ColoredLine from "./ColoredLine";
import ChangesComponent from "./ChangesComponent";
import { copyAndRemoveItem } from "../utils/helpers";

const styles = () => ({
  body: {
    display: "flex"
  },
  first: {
    color: "red"
  },
  second: {
    color: "blue"
  },
  third: {
    color: "green"
  },
  hamburger: {
    cursor: "pointer",
    float: "left",
    height: "16px",
    margin: "4px 4px 4px 4px",
    width: "16px"
  },
  invisible: {
    display: "none"
  },
  page: {
    // main page theme
    alignitems: "stretch",
    color: "white",
    flexdirection: "row",
    textAlign: "center",
    width: "100%"
  },
  songListDiv: {
    // song list div
    flex: "33%"
  },
  songListItem: {
    // ListItem component
    cursor: "move",
    display: "flex"
  },
  songListItemDiff: {
    // The ranking component "1 /\"
    backgroundColor: "#1F2533",
    height: "24px",
    marginRight: "20px",
    width: "64px"
  },
  songListItemDiv: {
    // The draggable div component
    display: "flex",
    width: "100%"
  },
  songListItemDivToggled: {
    // The draggable div component
    backgroundColor: "#1F2533",
    display: "flex",
    width: "100%"
  },
  songListItemPic: {
    // The image containing the chevron
    float: "right",
    height: "16px",
    margin: "4px 2px 4px 0px",
    width: "16px"
  },
  selectDiv: {
    // whole
    flex: "67%"
  },
  table: {
    margin: "0px auto",
    width: "90%"
  },
  tableCell: {
    color: "white",
    userSelect: "none"
  },
  tableCellEdit: {
    color: "white",
    width: "24px"
  }
});

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compareIndex: 0,
      songs: props.songs
    };
    this.firebaseController = this.props.firebaseController;
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  /**
   * Compares 2 objects by their name property
   * @param {Object 1} a
   * @param {Object 2} b
   */
  compareByName(a, b) {
    return a.name.toLowerCase() > b.name.toLowerCase()
      ? 1
      : a.name.toLowerCase() < b.name.toLowerCase()
      ? -1
      : 0;
  }

  /**
   * Gets the additions and removals between the current playlist and the
   * one selected in the select component.
   * Returns an array with the additions in index 0 and removals in index 1
   */
  getPlaylistChanges() {
    let selected = this.props.selected;
    let cIndex = this.state.compareIndex;
    let additions = [];
    let removals = [];
    if (selected !== -1) {
      let curr = this.state.songs[selected].slice();
      let other = copyAndRemoveItem(this.state.songs, cIndex)[cIndex].slice();
      curr.sort(this.compareByName);
      other.sort(this.compareByName);
      console.log(curr.length + "  " + other.length);
      let iCurr = 0;
      let iOther = 0;
      for (let i = 0; i < Math.max(curr.length, other.length); i++) {
        let song1 = iCurr < curr.length ? curr[iCurr].name.toLowerCase() : null;
        let song2 =
          iOther < other.length ? other[iOther].name.toLowerCase() : null;
        if (song1 === song2) {
          iCurr++;
          iOther++;
        } else if (!song2 || song1 < song2) {
          additions.push(curr[iCurr]);
          iCurr++;
        } else if (!song1 || song1 > song2) {
          removals.push(other[iOther]);
          iOther++;
        }
      }
      return [additions, removals];
    }
  }

  /**
   * Returns the HTML that is passed into the Select component
   * by generating MenuItems with the playlist's name
   * @param {The array consisting of the valid
   * monthly playlists to compare to} options
   */
  getSelectOptions(options) {
    let components = [];
    for (let i = 0; i < options.length; i++) {
      let menuItemComponent = (
        <MenuItem key={i} value={i}>
          {options[i].name}
        </MenuItem>
      );
      components.push(menuItemComponent);
    }
    return components;
  }

  /**
   * Updates the state compareIndex variable with the selected value
   * @param {Event with the new selected index} event
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
    let monthlySongs = songArray[this.props.selected];
    const draggedOverItem = monthlySongs[index];

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
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
    const { classes, playlists, selected } = this.props;
    let rankingEditsToggled = this.state.rankingEditsToggled;

    if (selected === -1 || !this.state.songs) return null;
    else {
      // Options for the select component
      let options = this.getSelectOptions(
        copyAndRemoveItem(playlists, selected)
      );
      // Index 0 is additions, index 1 is removals
      let changes = this.getPlaylistChanges();
      return (
        <div className={classes.page}>
          <Header
            playlist1={playlists[selected]}
            playlist2={
              copyAndRemoveItem(playlists, selected)[this.state.compareIndex]
            }
          />
          <div className={classes.body}>
            <div className={classes.songListDiv}>
              <div style={{ margin: "0px 20px 0px 20px" }}>
                <ColoredLine color="white" height="1px" />
                <Button
                  variant="contained"
                  onClick={() =>
                    this.toggleRankingEdits(playlists[selected].name, selected)
                  }
                >
                  {rankingEditsToggled ? "Save" : "Edit"}
                </Button>
              </div>
              <div style={{ display: "flex" }}>
                <Table className={classes.table}>
                  <TableBody>
                    {this.state.songs[selected].map((item, index) => (
                      <TableRow
                        ref="tableRow"
                        key={index}
                        onDragOver={() => this.onDragOver(index)}
                        onDragStart={e => this.onDragStart(e, index)}
                        onDragEnd={this.onDragEnd}
                      >
                        <TableCell
                          className={classes.tableCell}
                          component="th"
                          scope="row"
                        >
                          <div
                            className={
                              index === 0
                                ? classes.first
                                : index === 1
                                ? classes.second
                                : index === 2
                                ? classes.third
                                : "none"
                            }
                          >
                            <Typography> {index + 1} </Typography>
                          </div>
                        </TableCell>
                        <TableCell className={classes.tableCell} align="right">
                          {item.name}
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
            <div className={classes.selectDiv}>
              <ChangesComponent
                additions={changes[0]}
                compareIndex={this.state.compareIndex}
                handleSelectChange={this.handleSelectChange}
                options={options}
                removals={changes[1]}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(Summary);
