import React, { Component } from 'react';
import {
  Button,
  Paper,
  Typography,  withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
const styles = () => ({
  descriptionBullet: {
    color: '#555555',
    fontSize: '15px',
  },
  descriptionText: {
    fontSize: '18px',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'flex-start',
  },
  innerFlex: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: '40vh',
    width: '100%',
  },
  pageButton: {
    fontSize: '24px',
    marginBottom: '16px',
  },
  pageContainer: {
    borderRadius: '10px',
    // height: '35%',
    padding: '24px 8px 8px 8px',
    textAlign: 'center',
    width: '40%',
  },
  pageLink: {
    textDecoration: 'none',
  },
  title: {
    textAlign: 'center',
  }
});

class Home extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.flex}>
        <Header />
        <div className={classes.innerFlex}>
          <Paper elevation={3} className={classes.pageContainer}>
            <Link to='/monthly' className={classes.pageLink}>
              <Button variant='contained' color='primary' className={classes.pageButton}
                onClick={this.unselectAllPlaylists}> Monthly Playlists
              </Button>
            </Link>
            <div>
              <Typography variant="body1" className={classes.descriptionText}>
                Handy tool if you create a new monthly playlist each month
              </Typography>
              <Typography variant="body1" className={classes.descriptionBullet}>
                - Track the songs that are added and removed each month
              </Typography>
            </div>
          </Paper>
          <Paper elevation={3} className={classes.pageContainer}>
            <Link to='/Manager' className={classes.pageLink}>
              <Button variant='contained' color='primary' className={classes.pageButton}
                onClick={this.unselectAllPlaylists}> Manager
              </Button>
            </Link>
            <div>
              <Typography variant="body1" className={classes.descriptionText}>
                Manage your Spotify playlists
              </Typography>
              <Typography variant="body1" className={classes.descriptionBullet}>
                - Combine any of your playlists together
              </Typography>
              <Typography variant="body1" className={classes.descriptionBullet}>
                - Mass delete playlists by name
              </Typography>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);