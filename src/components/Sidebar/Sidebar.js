import React, {Component} from 'react';
import './Sidebar.css'

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.playlists.map(item => (
            <li key={item.name}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Sidebar;
