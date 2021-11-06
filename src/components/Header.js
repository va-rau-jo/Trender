
/**
 * Common header template to be used for separate pages.
 */
import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '10%',
  },
  header: {
    margin: 'auto',
  },
  tab: {
    cursor: 'pointer',
    display: 'flex',
    flexGrow: '1',
    justifyContent: 'center',
    listStyle: 'none',
    padding: '6px 12px',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: 'red',
    }
  },

  tabs: {
    backgroundColor: '#434343',
    color: 'white',
  },
  tabList: {
    display: 'flex',
    margin: '0 16px',
    padding: '0',
  },
  title: {
    backgroundColor: '#F2F2F2',
    textAlign: 'center',
  }
});

class Header extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Typography className={classes.title} variant='h3'>
          Trender
        </Typography>
        <div className={classes.tabs}>
          <TabList className={classes.tabList}>
            <Tab className={classes.tab}> <Typography variant='h6'> Monthly Playlists </Typography> </Tab>
            <Tab className={classes.tab}> <Typography variant='h6'> Manager </Typography> </Tab>
          </TabList>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
