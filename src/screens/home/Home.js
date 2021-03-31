import React, { Component } from "react";
import Header from "../../common/header/Header";
import { withStyles } from "@material-ui/core/styles";
import "./Home.css";

const styles = {
  card: { width: "90%", cursor: "pointer" },
};

class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        Home
      </div>
    );
  }
}

export default withStyles(styles)(Home);
