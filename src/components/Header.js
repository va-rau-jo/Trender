
/**
 * Common header template to be used for separate pages.
 */
import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';

const styles = () => ({
  container: {
    display: 'flex',
    height: '10%',
  },
  header: {
    margin: 'auto',
  }
});

class Header extends Component {
  render() {
    const { classes, title } = this.props;
    return (
      <div className={classes.container}>
        <Typography className={classes.header} variant='h3'>
          {title}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
