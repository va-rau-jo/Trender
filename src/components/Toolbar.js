import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import ColoredLine from "./ColoredLine";

const styles = () => ({
  background: {
    margin: "0px 0px 0px 0px"
  },
  title: {
    fontWeight: "bold",
    margin: "0px 0px 0px 20px"
  }
});

class Toolbar extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography className={classes.title} variant="h5">
          Trender
        </Typography>
        <ColoredLine color="white" height="2px" />
      </div>
    );
  }
}
export default withStyles(styles)(Toolbar);
