import React, { Component } from "react";
import {
  List,
  ListItem,
  Select,
  Typography,
  withStyles
} from "@material-ui/core";
import styles from "./styles";

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
