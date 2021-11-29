import React, { Component } from 'react';
import {
  Button,
  Paper,
  Typography,  withStyles } from '@material-ui/core';
import { SHARED_STYLES } from '../utils/sharedStyles';

const styles = () => ({
  button: {
    backgroundColor: SHARED_STYLES.SPOTIFY_GREEN,
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    boxShadow: SHARED_STYLES.BOX_SHADOW_SCALED,
    color: 'white',
    padding: '1.5vh 2vw',
    width: 'fit-content',
    '&:hover': {
      backgroundColor: '#1ed35e'
    }
  },
  buttonText: {
    fontSize: '3vh',
    fontWeight: 'bold',
    paddingLeft: '1vw',
  },
  flex: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: SHARED_STYLES.PAGE_HEIGHT,
    justifyContent: 'flex-end',
  },
  flexHorizontal: {
    display: 'flex',
    width: '100%',
  },
  listItem: {
    listStyle: 'none',
  },
  permissionLabel: {
    fontSize: SHARED_STYLES.FONT_SIZE_MED,
    margin: '0 0 2vh 1vw',
    whiteSpace: 'nowrap',
  },
  permissionName: {
    fontSize: SHARED_STYLES.FONT_SIZE_XLARGE,
    fontFamily: 'Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New',
    whiteSpace: 'nowrap',
  },
  permissionType: {
    fontSize: SHARED_STYLES.FONT_SIZE_HEADER,
    fontWeight: 'bold',
  },
  permissionsContainer: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    borderRadius: SHARED_STYLES.BORDER_RADIUS,
    display: 'flex',
    flexDirection: 'column',
    margin: '1vw',
    padding: '1vh 1vw',
    width: '50%',
  },
  permissionsDiv: {
    alignItems: 'center',
    backgroundColor: '#333333',
    boxShadow: SHARED_STYLES.BOX_SHADOW_SCALED,
    display: 'flex',
    flexDirection: 'column',
    margin: '2vh 0',
    padding: '1vh 0',
  },
  permissionsList: {
    margin: '2vh 0 0 0',
    padding: '0 1vw',
  },
  spotifyIcon: {
    height: '5vh',
  },
  title: {
    color: SHARED_STYLES.SPOTIFY_GREEN,
    fontSize: '3vh',
    fontWeight: 'bold',
    margin: '0.5vh 0'
  }
});

class Login extends Component {
  render() {
    const { classes } = this.props;

    const redirect = window.location.href.includes('localhost')
      ? 'http://localhost:8888/'
      : 'https://spotify-trender-server.herokuapp.com';

    return (
      <div className={classes.flex}>
        <Button className={classes.button} variant='contained' onClick={() => window.location.replace(redirect) }>
          <img className={classes.spotifyIcon} src='images/spotify_white.png' alt='spotify' />
          <Typography className={classes.buttonText} variant='h6'>
            Login with Spotify
          </Typography>
        </Button>
        <Paper className={classes.permissionsDiv} elevation={3} >
          <Typography className={classes.title} variant='h1'> PERMISSIONS </Typography>
          <div className={classes.flexHorizontal}>
            <div className={classes.permissionsContainer}>
              <Typography className={classes.permissionType} variant='h2'>
                Playlists
              </Typography>
              <ul className={classes.permissionsList}>
                <li className={classes.listItem}> 
                  <Typography className={classes.permissionName} variant='body1'>
                    'playlist-modify-private'
                  </Typography>
                  <Typography className={classes.permissionLabel} variant='body1'>
                    - Create and delete private playlists
                  </Typography>
                </li>
                <li className={classes.listItem}> 
                  <Typography className={classes.permissionName} variant='body1'>
                    'playlist-read-collaborative'
                  </Typography>
                  <Typography className={classes.permissionLabel} variant='body1'>
                    - Display public and collaborative playlists
                  </Typography>
                </li>
                <li className={classes.listItem}> 
                  <Typography className={classes.permissionName} variant='body1'>
                    'playlist-read-private'
                  </Typography>
                  <Typography className={classes.permissionLabel} variant='body1'>
                    - Display your private playlists
                  </Typography>
                </li>
                <li className={classes.listItem}> 
                  <Typography className={classes.permissionName} variant='body1'>
                    'playlist-modify-public'
                  </Typography>
                  <Typography className={classes.permissionLabel} variant='body1'>
                    - Create and delete public and collaborative playlists
                  </Typography>
                </li>
              </ul>
            </div>
            <div className={classes.permissionsContainer}>
              <Typography className={classes.permissionType} variant='h2'>
                Playback
              </Typography>
              <ul className={classes.permissionsList}>
                <li className={classes.listItem}> 
                  <Typography className={classes.permissionName} variant='body1'>
                    'app-remote-control'
                  </Typography>
                  <Typography className={classes.permissionLabel} variant='body1'>
                    - Playing and pausing music 
                  </Typography>
                </li>
                <li className={classes.listItem}> 
                  <Typography className={classes.permissionName} variant='body1'>
                    'streaming'
                  </Typography>
                  <Typography className={classes.permissionLabel} variant='body1'>
                    - Streaming music
                  </Typography>
                </li>
              </ul>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

// 'app-remote-control',
//       'playlist-modify-private',
//       'playlist-modify-public',
//       'playlist-read-private',
//       'streaming',
//       'user-read-private'

export default withStyles(styles)(Login);