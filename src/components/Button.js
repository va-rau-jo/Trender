import React, { Component } from "react";
import { Button, withStyles } from "@material-ui/core";

const styles = () => ({
  primary: {
  },
  secondary: {
  },
  settings: {
  },
  titleText: {
  }
});

class StyledButton extends Component {
  render() {
    const { classes } = this.props;
    const buttonType = this.props.type;
    let style = null;
    switch(buttonType) {
        case "primary":
            style = classes.primary;
            break;
        case "secondary":
            style = classes.secondary;
            break;
    }
    return (
        <Button className={style}> </Button>
    );
  }
}

export default withStyles(styles)(StyledButton);
