
/**
 * Common header template to be used for separate pages.
 */
import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '50px',
  },
  header: {
    margin: 'auto',
  },
  logo: {
    alignItems: 'center',
    display: 'inline-flex',
    height: '100%',
  },
  logoLink: {
    marginLeft: '8px',
    textDecoration: 'none',
  },
  // tab: {
  //   color: 'white',
  //   cursor: 'pointer',
  //   display: 'flex',
  //   flexGrow: '1',
  //   justifyContent: 'center',
  //   listStyle: 'none',
  //   padding: '6px 12px',
  //   textDecoration: 'none !important',
  //   userSelect: 'none',
  //   '&:hover': {
  //     backgroundColor: '#222222',
  //   }
  // },
  tabs: {
    backgroundColor: '#434343',
    color: 'white',
    height: '-webkit-fill-available'
  },
  title: {
    color: 'white',
    margin: '0 8px',
    padding: '4px 0',
    textAlign: 'center',
  }
});

/** Height set to 6% */
class Header extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.tabs}>
          <a href='/' className={classes.logoLink}>
            <div className={classes.logo}>
              <img height={36} src='./images/logo.png' alt='Trender logo' />
              <Typography className={classes.title} variant='h4'>
                Trender
              </Typography>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
