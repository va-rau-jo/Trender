import React, {Component} from 'react';
import Sidebar from './Sidebar'
import Summary from './Summary'

class MainContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Sidebar playlists={this.state.playlists} />
        <Summary/>
      </div>
    );
  }
}

export default MainContainer;
