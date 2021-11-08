
/**
 * Common header template to be used for separate pages.
 */
import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { TabList } from 'react-tabs';

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
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
    textDecoration: 'none',
  },
  selected: {
    background: 'blue',
  },
  tab: {
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'center',
    listStyle: 'none',
    padding: '6px 12px',
    textDecoration: 'none !important',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: '#222222',
    }
  },
  tabs: {
    backgroundColor: '#434343',
    color: 'white',
  },
  tabList: {
    display: 'flex',
    margin: '0 0 0 16px',
    padding: '0',
  },
  title: {
    color: 'white',
    margin: '0 8px',
    textAlign: 'center',
  }
});

class Header extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.tabs}>
          <TabList className={classes.tabList}>
            <a href='/' className={classes.logoLink}>
              <div className={classes.logo}>
                <img height={24} src='./images/logo.png' alt='Trender logo' />
                <Typography className={classes.title} variant='h6'>
                  Trender
                </Typography> 
              </div>
            </a>
            {/* <Link to='/monthly' className={classes.tab}>
              <Button> 
                <Typography variant='h6'>
                  Monthly Playlists
                </Typography>
              </Button>
            </Link>
            <Tab className={classes.tab}>
              <Typography variant='h6'>
                Manager
              </Typography>
            </Tab> */}
          </TabList>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
