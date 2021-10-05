import React, { Component } from 'react';
import {
  Button,
  ImageList,
  ImageListItem,
  ListSubheader,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';
import LoadingIndicator from '../components/LoadingIndicator';
import SpotifyAPIManager from '../utils/SpotifyAPIManager';
import ProgressIndicator from '../components/ProgressIndicator';



/**
 * This is preferred over using an external css file for styling because React
 * components that are imported have their own classes that override CSS classes
 * in external files. The classes defined here will override the CSS classes
 * that the React components provide. The CSS will actually follow this!
 */
const styles = () => ({
  body: {
    height: '100%',
    textAlign: 'center',
  },
  buttonDiv: {
    marginTop: '8px',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    height: '90%',
  },
  inputDiv: {
    minHeight: '400px',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    textAlign: 'center',
  },
  listItemDescription: {
    backgroundColor: '#000000CC',
    borderRadius: '0 0 10px 10px',
    bottom: '0',
    height: '65px',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
  },
  listItemText: {
    color: 'white',
  },
  playlistList: {
    background: 'white',
    borderRadius: '10px',
    justifyContent: 'space-evenly',
    // overrides ImageList inline style
    margin: '5px 20px 20px 20px !important',
    padding: '20px',
    transform: 'translateZ(0)',
  },
  playlistListImage: {
    borderRadius: '10px',
  },
  // Overriding default inline style for ListItem
  playlistListItem: {
    border: '4px solid white',
    borderRadius: '16px',
    height: '200px !important',
    margin: '5px',
    padding: '0px !important',
    width: '200px !important',
  },
  textField: {
    marginTop: '24px',
  }
});

class Deleter extends Component {
  constructor(props) {
    super(props);
  }

  deletePlaylists = () => {
    const input = document.getElementById('playlistNameInput');
    const text = input ? input.value : '';
    SpotifyAPIManager.deletePlaylists(this.state.playlists, text)
      .then(res => {
        console.log(res);
      });
  }

  render() {
    const { accessToken, classes } = this.props;

    return (<>

    </>);
  }
}

export default withStyles(styles)(Deleter);