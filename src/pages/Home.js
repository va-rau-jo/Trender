import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import { Link } from 'react-router-dom';

const styles = () => ({
  // TODO: fix formatting for pagebutton
  pageButton: {
    fontSize: "24px",
  }
});

class Home extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageButton}>
        <Link to="/monthly" className="btn btn-primary">hello</Link>
      </div>
    );
  }
}

export default withStyles(styles)(Home);