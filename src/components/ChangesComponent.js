import React, { Component } from "react";
import {
  List,
  ListItem,
  Select,
  Typography,
  withStyles
} from "@material-ui/core";

const styles = () => ({
  additions: {
    // additions div
    flex: "50%"
  },
  additionListItem: {
    // song in additions div
    color: "#27E8A7"
  },
  changes: {
    // additions and removals div
    display: "flex",
    flex: "100%"
  },
  removalListItem: {
    // song in removals div
    color: "#DF4576"
  },
  removals: {
    // removals div
    flex: "50%"
  },
  select: {
    // select component
    border: "5px solid black",
    color: "white",
    width: "120px"
  }
});

class ChangesComponent extends Component {
  handleSelectChange = event => {
    this.props.handleSelectChange(event);
  };

  render() {
    const { additions, classes, compareIndex, options, removals } = this.props;
    console.log(compareIndex);
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
                {additions.map((value, index) => {
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
                {removals.map((value, index) => {
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
