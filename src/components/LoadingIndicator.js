import React, { Component } from "react";
import { withStyles } from "@material-ui/core";

const styles = () => ({
  center: {
    margin: 'auto',
    textAlign: 'center',
  },
  image: {
    height: '100px',
    width: '100PX',
  },
});

class LoadingIndicator extends Component {
  render() {
    const { classes } = this.props;

    return (
      // Icon from Icons8
      <div className={classes.center}>
        <img className={classes.image} src="/images/loading-icon.gif" />
      </div>
    );
  }
}

export default withStyles(styles)(LoadingIndicator);
