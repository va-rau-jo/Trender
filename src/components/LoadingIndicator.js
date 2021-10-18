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
    const { classes, scale } = this.props;

    return (
      <div className={classes.center}>
        <CircularProgress size={scale} />
      </div>
    );
  }
}

export default withStyles(styles)(LoadingIndicator);
