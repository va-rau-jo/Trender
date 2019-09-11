import React, {Component} from 'react';
import { List, ListItem, MenuItem, Select, Typography, withStyles } from '@material-ui/core';
import Header from './Header';
import ColoredLine from './ColoredLine';

const styles = () => ({
  additions: { // additions div
    flex: '50%'
  },
  additionListItem: { // song in additions div
    color: '#27E8A7',
  },
  body: {
    display: 'flex'
  },
  changes:{ // additions and removals div
    display: 'flex',
    flex: '100%'
  },
  draggable:{ // style to drag songs around
    cursor: 'move',
  },
  lineMargin: { // margin to make the horizontal line divider shorter
    margin: '0px 20px 0px 20px'
  },
  page: { // main page theme
    alignitems: 'stretch',
    color: 'white',
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
    width: '120px'
  },
  songList: { // song list
    margin: '0px 0px 0px 15px'
  },
  songs : { // song list div
    flex: '33%'
  },
  selectDiv:{ // whole
    flex: '67%'
  }
});

class Sidebar extends Component {
  constructor(props) {
    super(props);
    //console.log(props)
    this.state = {
      compareIndex: 0,
      songs: props.songs,
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
   * Event handler that starts when the user starts dragging a song
   */
  onDragStart = (event, index) => {
    this.draggedItem = this.state.songs[this.props.selected][index];
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", event.target.parentNode);
    event.dataTransfer.setDragImage(event.target.parentNode, 20, 20);
  }

  /**
   * Event handler for when a song is in the process of being reordered
   */
  onDragOver = index => {
    let songArray = this.state.songs;
    let monthlySongs = songArray[this.props.selected];
    const draggedOverItem = monthlySongs[index];

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }

    // filter out the currently dragged item
    let updatedSongs = monthlySongs.filter(item => item !== this.draggedItem);
    // add the dragged item after the dragged over item
    updatedSongs.splice(index, 0, this.draggedItem);
    songArray[this.props.selected] = updatedSongs;
    this.setState({
      songs: songArray
    });
  };

  /**
   * Event handler for when the user is done reordering a song
   */
  onDragEnd = () => {
    this.draggedIndex = null;
  };

  /**
   * Helper function that copies the array provided and removes
   * the element at the selected index
   * @param {Array to be spliced} array 
   */
  removeSelectedPlaylist(array) {
    let a = array.slice();
    a.splice(this.props.selected, 1);
    // console.log("sliced")
    // console.log(a)
    return a;
  }

  render() {
    const { classes, playlists, selected } = this.props;
    if (selected === -1 || !this.state.songs)
      return null;
    else {
      // Options for the select component
      let options = this.getSelectOptions(this.removeSelectedPlaylist(playlists));
      // Index 0 is additions, index 1 is removals
      let changes = this.getPlaylistChanges();
      return (
        <div className={classes.page}>
          <Header playlist1={playlists[selected]} playlist2={this.removeSelectedPlaylist(playlists)[this.state.compareIndex]} />
          <div className={classes.body}>
            <div className={classes.songs}>
              <div className={classes.lineMargin}>
                <ColoredLine color="white" height="1px" />
              </div>
              <List className={classes.songList} >
                {this.state.songs[selected].map((item, idx) => (
                  <ListItem key={idx} onDragOver={() => this.onDragOver(idx)}>
                    <div draggable
                      className={classes.draggable} 
                      onDragStart={e => this.onDragStart(e, idx)}
                      onDragEnd={this.onDragEnd}
                    >
                      <Typography>{item.name}</Typography>
                    </div>
                  </ListItem>
                ))}
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
            <div>
            <h3>List of items</h3>
          <ul>
            {this.state.items.map((item, idx) => (
              <li key={item} onDragOver={() => this.onDragOver(idx)}>
                <div
                  className={classes.draggable}
                  draggable
                  onDragStart={e => this.onDragStart(e, idx)}
                  onDragEnd={this.onDragEnd}
                >
                  <span className="content">{item}</span>
                </div>
              </li>
            ))}
          </ul>
            </div>
          </div>
        </div> 
      );
    }
  }
}

export default withStyles(styles)(Sidebar);
