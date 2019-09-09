import React, {Component} from 'react';
import { List, ListItem, MenuItem, Select, Typography, withStyles } from '@material-ui/core';

const styles = () => ({
  page: {
    alignitems: 'stretch',
    color: 'white',
    display: 'flex',
    flexdirection: 'row',
    textAlign: 'center',
    width: '100%'
  },
  select: {
    border: '5px solid black',
    color: 'white',
    width: '100px'
  },
  songs : {
    flex: '25%'
  },
  changes:{
    flex: '75%'
  },
  additions: {
    flex: '33%'
  },
  removals : {
    flex: '33%'
  }
});

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      compareIndex: 0
    };
    this.comparePlaylists = this.comparePlaylists.bind(this);
  }

  comparePlaylists(event) {
    this.setState({
      compareIndex: event.target.value
    });
  }

  getSelectOptions(options) {
    let components = [];
    console.log(options[0])
    for (let i = 0; i < options.length; i++) {
      let menuItemComponent = (
        <MenuItem key={i} value={i}>
          {options[i].name}
        </MenuItem>
      );
      components.push(menuItemComponent);
    }
    return components;
  }

  render() {
    const { classes, selected, songs} = this.props;
    if (selected === -1 || !songs)
      return null;
    else {
      let songArray = songs[selected].items
      // Copy playlist array but remove the one already selected
      let selectOptions = this.props.playlists.slice();
      selectOptions.splice(selected, 1);
      let options = this.getSelectOptions(selectOptions);
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
          <div className={classes.changes}>

            
            <div className={classes.additions}>
              <Typography>Additions</Typography>
              
            </div>
            <div className={classes.removals}>
              <Typography>Removals</Typography>
            </div>
            <Select className={classes.select} onChange={this.comparePlaylists} value={this.state.compareIndex}>
              {options}
            </Select>
          </div>
          
        </div>
      );
    }
  }
}

export default withStyles(styles)(Sidebar);
