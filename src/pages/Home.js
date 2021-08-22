import React, { Component } from "react";
import { Link } from 'react-router-dom';

import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>  {/*className={classes.pageButton}> */}
        <Link to="/monthly" className="btn btn-primary">hello</Link>
      </div>
    );
  }
}

export default Home;