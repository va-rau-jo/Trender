import React, { Component } from "react";
import { withStyles } from "@material-ui/core";

const styles = () => ({
  center: {
    height: '100%',
    margin: 'auto',
    textAlign: 'center',
  },
  image: {
    bottom: '0',
    display: 'block',
    margin: 'auto',
    height: '100px',
    left: '0',
    position: 'absolute',
    right: '0',
    top: '0',
    width: '100px',
  },
});

class LoadingIndicator extends Component {
  render() {
    const { classes } = this.props;

    return (
      // Icon from Icons8
      <div className={classes.center}>
        <img className={classes.image} src="/images/loading-icon.gif"
          alt="loading" />
      </div>
    );
  }
}

export default withStyles(styles)(LoadingIndicator);
