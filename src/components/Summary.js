import React, {Component} from 'react';
import { List, ListItem, Typography, withStyles } from '@material-ui/core';

const styles = () => ({
  page: {
    alignitems: 'stretch',
    color: 'white',
    display: 'flex',
    flexdirection: 'row',
    textAlign: 'center',
    width: '100%'
  },
  songs : {
    flex: '1 0 33%'
  },
  additions: {
    flex: '0 0 33%'
  },
  removals : {
    flex: '1 0 33%'
  }
});

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, selected, songs} = this.props;
    if (selected === -1 || !songs)
      return null;
    else {
      //console.log(songs)
      let songArray = songs[selected].items
      return (
        <div className={classes.page}>
          <div className={classes.songs}>
            <Typography>Songs</Typography>
            <List>
              {songArray.map((value, index) => {
                //console.log(value)
                return (
                  <ListItem key={index}>
                    <Typography>{value.track.name}</Typography>
                  </ListItem>
                )
              })}
            </List>
          </div>
          <div className={classes.additions}>
            <Typography>Additions</Typography>
            
          </div>
          <div className={classes.removals}>
            <Typography>Removals</Typography>
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(Sidebar);
