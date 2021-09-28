
/**
 * Common header template to be used for separate pages.
 */
import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';

const styles = () => ({
  header: {
    paddingTop: '20px',
    textAlign: 'center',
  }
});

class Header extends Component {
  render() {
    const { classes, title } = this.props;
    return (
      <Typography className={classes.header} variant='h3'>
        {title}
      </Typography>
    );
  }
}

export default withStyles(styles)(Header);
