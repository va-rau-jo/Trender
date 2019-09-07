import React, {Component} from 'react';
import { MenuList, MenuItem, Typography, withStyles } from '@material-ui/core';
import ColoredLine from './ColoredLine'

const styles = () => ({
  icon: {
    float: 'left',
    height: '24px',
    margin: '4px 0px 4px 32px',
    width: '24px',
  },
  list: {
    color: 'red',
    margin: '0px 0px 0px 15px',
  },
  listItem: {
    color: '#27E8A7',
  },
  titleText: {
    color: 'white',
    margin: '15px 0px 0px 0px',
    textAlign: 'center'
  }
});

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
  }

  setSelected = (index) => {
    this.setState({
      selected: index
    });
    console.log(index);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div>
          <img className={classes.icon} alt='playlist' src='/images/playlist.png'/>
          <Typography className={classes.titleText} variant="h6"> Monthly Playlists </Typography>
        </div>
        <ColoredLine color="white" height="1px" />
        <MenuList>
          {this.props.playlists.map((value, index) => {
            return (
              <MenuItem button key={index} selected={this.state.selected === {index}} 
                 onClick={() => this.setSelected({index})}>
                <Typography className={classes.listItem}>{value.name}</Typography>
              </MenuItem>
            )
          })}
        </MenuList>
      </div>
    );
  }
}

export default withStyles(styles)(Sidebar);
