import React, { Component } from "react";
import { CircularProgress, withStyles } from "@material-ui/core";

const styles = () => ({
  center: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  }
});

class LoadingIndicator extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.center}>
        <CircularProgress size={100} />
      </div>
    );
  }
}

export default withStyles(styles)(LoadingIndicator);
