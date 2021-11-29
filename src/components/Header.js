/**
 * Common header template to be used for separate pages.
 */
import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { url } from 'inspector';

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '5vh',
  },
  header: {
    margin: 'auto',
  },
  logoDiv: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'inline-flex',
    height: '100%',
  },
  logo: {
    height: '4vh',
  },
  logoLink: {
    display: 'flex',
    marginLeft: '1vh',
    textDecoration: 'none',
    width: 'fit-content',
  },
  tabs: {
    backgroundColor: '#434343',
    color: 'white',
    height: '-webkit-fill-available'
  },
  title: {
    color: 'white',
    fontSize: '4vh',
    margin: '0 1vh',
    textAlign: 'center'
  }
});

class Header extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.tabs}>
          <a href='/login' className={classes.logoLink}>
            <div className={classes.logoDiv} onClick={() => window.location.replace('/')}>
              <img className={classes.logo} src={url('./images/logo.png')} alt='Trender logo' />
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
