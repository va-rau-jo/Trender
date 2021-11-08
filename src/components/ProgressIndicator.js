import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";

const styles = () => ({
  center: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '85%',
  },
  linearInternal: {
    backgroundColor: '#3f51b5',
  },
  linearRoot: {
    backgroundColor: 'rgb(182, 188, 226)',
    height: '4px',
    marginTop: '16px',
    overflow: 'hidden',
    width: '65%',
  }
});

class ProgressIndicator extends Component {
  render() {
    let { classes, progress, total } = this.props;
    // if null or undefined, set progress to 0
    progress = (progress !== null && progress !== undefined) ? progress : 0;
    total = (total !== null && total !== undefined) ? total : 1;
    const percentage =
      'translateX(' + ((1.0 * progress / total * 100) - 100) + '%';

    return (
      <div className={classes.center}>
        <Typography variant='h4'>
          Loading Playlist Songs...
        </Typography>
        <div className={classes.linearRoot} role="progressbar" aria-valuemin="0"
          aria-valuenow={progress} aria-valuemax={total}>
          <div id='linear-progress' className={classes.linearInternal}
            style={{height: '100%', transform: percentage }}>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ProgressIndicator);
