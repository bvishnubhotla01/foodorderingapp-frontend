import React, { Component } from "react";
import "./Header.css";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    color: "#FFFFFF",
  },
  searchInput: {
    width: "80%",
    color: "white",
  },
  icon: {
    color: "#FFFFFF",
    fontSize: 32,
  },
  formControl: {
    width: "90%",
  },
};

class Header extends Component {
  componentDidMount() {}

  render() {
    return <div>Food Ordering App</div>;
  }
}
export default withStyles(styles)(Header);
