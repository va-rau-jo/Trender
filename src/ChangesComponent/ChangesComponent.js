import React, { Component } from "react";
import {
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
  withStyles
} from "@material-ui/core";
import styles from "./styles";

class ChangesComponent extends Component {
  handleSelectChange = event => {
    this.props.handleSelectChange(event);
  };

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
  getPlaylistChanges(curr, other) {
    let additions = [];
    let removals = [];
    curr.sort(this.compareByName);
    other.sort(this.compareByName);
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
    return { additions: additions, removals: removals };
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

  render() {
    const {
      classes,
      compareIndex,
      playlists,
      songList1,
      songList2
    } = this.props;
    let options = this.getSelectOptions(playlists);
    let changes = this.getPlaylistChanges(songList1, songList2);
    return (
      <div>
        <Select
          className={classes.select}
          onChange={this.handleSelectChange}
          value={compareIndex}
        >
          {options}
        </Select>
        <div className={classes.changes}>
          <div className={classes.additions}>
            <Typography>Additions</Typography>
            <div>
              <List>
                {changes.additions.map((value, index) => {
                  return (
                    <ListItem key={index} className={classes.additionListItem}>
                      <Typography>{value.name}</Typography>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
          <div className={classes.removals}>
            <Typography>Removals</Typography>
            <div>
              <List>
                {changes.removals.map((value, index) => {
                  return (
                    <ListItem key={index} className={classes.removalListItem}>
                      <Typography>{value.name}</Typography>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ChangesComponent);
