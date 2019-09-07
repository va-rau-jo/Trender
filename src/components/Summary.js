import React, {Component} from 'react';
import { Typography, withStyles } from '@material-ui/core';

const styles = () => ({
  page: {
    alignitems: 'stretch',
    color: 'white',
    display: 'flex',
    flexdirection: 'row',
    textAlign: 'center',
    width: '100%'
  },
  additions: {
    flex: '0 0 50%'
  },
  removals : {
    flex: '1 0 50%'
  }
});

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  getSongs = (id) => {
    let songs = [];

    fetch(base_url + 'playlists/' + id + '/tracks', {
      headers: {'Authorization' : 'Bearer ' + accessToken}
    })
      .then(res => res.json())
      .then(playlistData => {
        let items = playlistData.items;

        for (let i = 0; i < items.length; i++) {
          let song = (
            <MenuItem key={items[i]} value={items[i]}>
              {items[i]}
            </MenuItem>
          );
          songs.push(song);
        }
        return songs;
      });
  }

  populateSummary = (index) => {
    let id = this.props.playlists[index].id;

    let songs = getSongs(id);


  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.page}>
        <div className={classes.additions}>
          <Typography>Additions</Typography>
          <div>
            {this.getSongs(0)}
          </div>
        </div>
        <div className={classes.removals}>
          <Typography>Removals</Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Sidebar);
