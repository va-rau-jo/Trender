import React, {Component} from 'react';
import { List, ListItem, MenuItem, Select, Typography, withStyles } from '@material-ui/core';

const styles = () => ({
  additions: { // additions div
    flex: '50%'
  },
  additionListItem: { // song in additions div
    color: '#27E8A7',
  },
  changes:{ // additions and removals div
    display: 'flex',
    flex: '100%'
  },
  page: {
    alignitems: 'stretch',
    color: 'white',
    display: 'flex',
    flexdirection: 'row',
    textAlign: 'center',
    width: '100%'
  },
  removalListItem: { // song in removals div
    color: '#DF4576',
  },
  removals : { // removals div
    flex: '50%'
  },
  select: { // select component
    border: '5px solid black',
    color: 'white',
    width: '100px'
  },
  songs : { // song lsit
    flex: '25%'
  },
  selectDiv:{ // whole
    flex: '75%'
  }
});

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compareIndex: 0,
      additions: [],
      removals: []
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  /**
   * Compares 2 objects by their name property
   * @param {Object 1} a 
   * @param {Object 2} b 
   */
  compareByName(a, b) {
    return (a.name.toLowerCase() > b.name.toLowerCase()) 
      ? 1 : (a.name.toLowerCase() < b.name.toLowerCase()) 
      ? -1 : 0; 
  }

  /**
   * Gets the additions and removals between the current playlist and the
   * one selected in the select component.
   * Returns an array with the additions in index 0 and removals in index 1
   */
  getPlaylistChanges() {
    let selected = this.props.selected;
    let additions = [];
    let removals = [];
    if (selected !== -1) {
      let curr = this.props.songs[selected].slice();
      let other = this.removeSelectedPlaylist(this.props.songs)[this.state.compareIndex];
      curr.sort(this.compareByName);
      other.sort(this.compareByName);

      let iCurr = 0;
      let iOther = 0;
      for(let i = 0; i < Math.max(curr.length, other.length); i++) {
        if(curr[iCurr].name.toLowerCase() === other[iOther].name.toLowerCase()) {
          iCurr++;
          iOther++;
        } else if(curr[iCurr].name.toLowerCase() < other[iOther].name.toLowerCase()) {
          additions.push(curr[iCurr]);
          iCurr++;
        } else if(curr[iCurr].name.toLowerCase() > other[iOther].name.toLowerCase()) {
          removals.push(other[iOther]);
          iOther++;
        }
      }
      return [additions, removals];
    }
  }

  /**
   * Returns the HTML that is passed into the Select component
   * 
   * @param {The array consisting of the valid 
   * monthly playlists to compare to} options 
   */
  getSelectOptions(options) {
    let components = [];
    //console.log(options[0])
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

  /**
   * Updates the state compareIndex variable with the selected value
   * @param {Event with the new selected index} event 
   */
  handleSelectChange(event) {
    this.setState({
      compareIndex: event.target.value
    });
  }

  /**
   * Helper function that copies the array provided and removes
   * the element at the selected index
   * @param {Array to be spliced} array 
   */
  removeSelectedPlaylist(array) {
    let a = array.slice();
    a.splice(this.state.selected, 1);
    return a;
  }

  render() {
    const { classes, playlists, selected, songs} = this.props;
    if (selected === -1 || !songs)
      return null;
    else {
      //console.log(songs)
      // Options for the select component
      let options = this.getSelectOptions(this.removeSelectedPlaylist(playlists));
      // Index 0 is additions, index 1 is removals
      let changes = this.getPlaylistChanges();
      console.log(playlists[selected].images[0].url)
      return (
        <div className={classes.page}>
          <div>
            <img src={playlists[selected].images[0].url} alt="Playlist" />
          </div>
          <div className={classes.songs}>
            <Typography>Songs</Typography>
            <List>
              {songs[selected].map((value, index) => {
                return (
                  <ListItem key={index}>
                    <Typography>{value.name}</Typography>
                  </ListItem>
                )
              })}
            </List>
          </div>
          <div className={classes.selectDiv}>
            <Select className={classes.select} onChange={this.handleSelectChange} value={this.state.compareIndex}>
              {options}
            </Select>
            <div className={classes.changes}>            
              <div className={classes.additions}>
                <Typography>Additions</Typography>
                <div>
                  <List>
                    {changes[0].map((value, index) => {
                      return (
                        <ListItem key={index} className={classes.additionListItem}>
                          <Typography>{value.name}</Typography>
                        </ListItem>
                      )
                    })}
                  </List>
                </div>
              </div>
              <div className={classes.removals}>
               <Typography>Removals</Typography>
               <div>
                  <List>
                    {changes[1].map((value, index) => {
                      return (
                        <ListItem key={index} className={classes.removalListItem}>
                          <Typography>{value.name}</Typography>
                        </ListItem>
                      )
                    })}
                  </List>
                </div>
              </div>
            </div>
          </div>
        </div> 
      );
    }
  }
}

export default withStyles(styles)(Sidebar);
