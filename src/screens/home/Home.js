import React, { Component } from "react";
import Header from "../../common/header/Header";
import { withStyles } from "@material-ui/core/styles";
import "./Home.css";
import * as HelperMethods from "../../common/Helpers";
import * as Constants from "../../common/Constants";

const styles = {
  card: { width: "90%", cursor: "pointer" },
};

class Home extends Component {
  render() {
    return (
      <div>
        <Header
          showSearch={true}
          history={this.props.history}
          baseUrl={this.props.baseUrl}
        />
        Home
      </div>
    );
  }
}

export default withStyles(styles)(Home);
