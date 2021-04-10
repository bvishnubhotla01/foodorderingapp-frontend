import React, { Component } from "react";
import "./Header.css";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import Fastfood from "@material-ui/icons/Fastfood";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Modal from "react-modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// Tabs
const TabContainer = function(props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: "center" }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Header extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      value: 0,
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      passwordReg: "",
      usernameRequired: "dispNone",
      passwordRequired: "dispNone",
      loginError: "dispNone",
      signupError: "dispNone",
      emailRequired: "dispNone",
      firstNameRequired: "dispNone",
      lastNameRequired: "dispNone",
      mobileRequired: "dispNone",
      passwordRegRequired: "dispNone",
      registrationSuccess: false,
      signUpErrorMsg: "",
      signUpErrCode: "",
      loginInvalidContactNo: "",
      loginErrCode: "",
      loginErrorMsg: "",
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
      showUserProfileDropDown: false,
      open: false,
      anchorEl: null,
      snackBarOpen: false,
      snackBarText: "",
      menuIsOpen: false,
      searchText : "",
    };
  }

  componentDidMount() {}

  openModalHandler = () => {
    this.setState({
      modalIsOpen: true,
      value: 0,
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      signUpErrorMsg: "",
      signUpErrCode: "",
      passwordReg: "",
      loginInvalidContactNo: "",
      loginErrCode: "",
      loginErrorMsg: "",
      usernameRequired: "dispNone",
      passwordRequired: "dispNone",
      loginError: "dispNone",
      signupError: "dispNone",
      emailRequired: "dispNone",
      firstNameRequired: "dispNone",
      lastNameRequired: "dispNone",
      mobileRequired: "dispNone",
      passwordRegRequired: "dispNone",
      loginErrorMsg: "",
    });
  };

  closeModalHandlerClickAway = () => {
    this.setState({ modalIsOpen: false });
    this.setState({ snackBarOpen: false });
  };

  closeModalHandler = () => {
    this.setState({ modalIsOpen: false });
    this.setState({ snackBarOpen: true });
  };

  tabChangeHandler = (event, value) => {
    this.setState({ value });
  };

  inputUsernameChangeHandler = (e) => {
    this.setState({ username: e.target.value });
  };
  inputPasswordChangeHandler = (e) => {
    this.setState({ password: e.target.value });
  };
  inputEmailChangeHandler = (e) => {
    this.setState({ email: e.target.value });
  };
  inputFirstNameChangeHandler = (e) => {
    this.setState({ firstName: e.target.value });
  };
  inputLastNameChangeHandler = (e) => {
    this.setState({ lastName: e.target.value });
  };
  inputMobileChangeHandler = (e) => {
    this.setState({ mobile: e.target.value });
  };
  inputPasswordRegisterChangeHandler = (e) => {
    this.setState({ passwordReg: e.target.value });
  };

  loginClickHandler = () => {
    //Clearing error texts during login
    this.setState({ loginInvalidContactNo: "" });

    //Checking if any input fields are empty
    this.state.username === ""
      ? this.setState({ usernameRequired: "dispBlock" })
      : this.setState({ usernameRequired: "dispNone" });
    this.state.password === ""
      ? this.setState({ passwordRequired: "dispBlock" })
      : this.setState({ passwordRequired: "dispNone" });
    this.state.loginErrorMsg === ""
      ? this.setState({ loginError: "dispBlock" })
      : this.setState({ loginError: "dispNone" });

    //If username and password both are null we return
    if (this.state.username === "" || this.state.password === "") {
      return;
    }
    let tempContactNo = this.state.username;
    //Checking if the contact number is a 10 digit number or not
    var reg = new RegExp("^[0-9]+$");
    if (tempContactNo.length !== 10 || !reg.test(tempContactNo)) {
      this.setState({ loginInvalidContactNo: "Invalid Contact" });
      return;
    }

    let that = this;
    let dataLogin = null;
    let xhrLogin = new XMLHttpRequest();
    xhrLogin.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        let loginResponse = JSON.parse(xhrLogin.response);
        if (
          loginResponse.code === "ATH-001" ||
          loginResponse.code === "ATH-002"
        ) {
          that.setState({ loginError: "dispBlock" });
          that.setState({ loginErrCode: loginResponse.code });
          that.setState({ loginErrorMsg: loginResponse.message });
        } else {
          sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
          sessionStorage.setItem(
            "access-token",
            xhrLogin.getResponseHeader("access-token")
          );
          sessionStorage.setItem(
            "firstName",
            JSON.parse(this.responseText).first_name
          );
          that.setState({
            firstName: JSON.parse(this.responseText).first_name,
          });
          that.setState({ loggedIn: true });
          that.closeModalHandler();
          that.setState({ snackBarText: "Logged in successfully!" });
          that.openMessageHandlerPostLogin();
        }
      }
    });
    xhrLogin.open("POST", 'http://localhost:8080/api/' + "customer/login");
    xhrLogin.setRequestHeader(
      "authorization",
      "Basic " + window.btoa(this.state.username + ":" + this.state.password)
    );
    xhrLogin.setRequestHeader("Content-Type", "application/json");
    xhrLogin.setRequestHeader("Cache-Control", "no-cache");
    xhrLogin.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhrLogin.send(dataLogin);
  };

  signUpClickHandler = () => {
    //clear error messages
    this.setState({ signUpErrorMsg: "" });
    this.setState({ signUpErrCode: "" });
    //Checking if any input fields are empty
    this.state.email === ""
      ? this.setState({ emailRequired: "dispBlock" })
      : this.setState({ emailRequired: "dispNone" });
    this.state.firstName === ""
      ? this.setState({ firstNameRequired: "dispBlock" })
      : this.setState({ firstNameRequired: "dispNone" });
    this.state.mobile === ""
      ? this.setState({ mobileRequired: "dispBlock" })
      : this.setState({ mobileRequired: "dispNone" });
    this.state.passwordReg === ""
      ? this.setState({ passwordRegRequired: "dispBlock" })
      : this.setState({ passwordRegRequired: "dispNone" });
    if (
      this.state.email === "" ||
      this.state.firstName === "" ||
      this.state.mobile === "" ||
      this.state.passwordReg === ""
    ) {
      return;
    }

    let that = this;
    let dataSignup = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email_address: this.state.email,
      password: this.state.passwordReg,
      contact_number: this.state.mobile,
    };

    let xhrSignup = new XMLHttpRequest();
    xhrSignup.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        let signupResponse = JSON.parse(this.response);
        if (
          signupResponse.code === "SGR-001" ||
          signupResponse.code === "SGR-002" ||
          signupResponse.code === "SGR-003" ||
          signupResponse.code === "SGR-004"
        ) {
          that.setState({ signupError: "dispBlock" });

          that.setState({ signUpErrCode: signupResponse.code });
          that.setState({ signUpErrorMsg: signupResponse.message });
        } else {
          that.setState({ registrationSuccess: true });
          that.setState({
            snackBarText: "Registered successfully! Please login now!",
          });
          that.openMessageHandler();
        }
      }
    });

    xhrSignup.open("POST", this.props.baseUrl + "customer/signup");
    xhrSignup.setRequestHeader("Content-Type", "application/json");
    xhrSignup.setRequestHeader("Cache-Control", "no-cache");
    xhrSignup.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhrSignup.send(JSON.stringify(dataSignup));
  };

  openMessageHandler = () => {
    this.setState({ snackBarOpen: true });
    this.setState({ modalIsOpen: true });
    this.setState({ value: 0 });
  };

  openMessageHandlerPostLogin = () => {
    this.setState({ snackBarOpen: true });
    this.setState({ modalIsOpen: false });
    this.setState({ value: 0 });
  };

  openMenuHandler = (event) => {
    this.setState({
      menuIsOpen: true,
    });
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  closeMenuHandler = () => {
    this.setState({
      menuIsOpen: false,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      showUserProfileDropDown: !this.state.showUserProfileDropDown,
    });
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackBarOpen: false });
  };

  inputHandler = (e)=>{
   //console.log(this.props)
   this.props.onChange(e)
  }

  colorChangeHandler = ()=>{
    let a = document.getElementById('search')
    a.style.borderBottom = '2px solid white'
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="topMain">
        <div className="header-main-container">
          <div className="header-logo-container">
            <Fastfood className={classes.icon} />
          </div>
          {this.props.showSearch && (
            <div className="header-search-container">
              <div className="search-icon">
                <SearchIcon style={{ color: "#FFFFFF" }} />
              </div>
              <Input
                className={classes.searchInput}
                placeholder="Search by Restaurant Name"
                onChange = {this.inputHandler}
                onClick = {this.colorChangeHandler}
                id = 'search'
              />
            </div>
          )}
          {!this.state.loggedIn ? (
            <div>
              <Button
                style={{ fontSize: "100%" }}
                variant="contained"
                color="default"
                onClick={this.openModalHandler}
              >
                <AccountCircle />
                <span style={{ marginLeft: "2%" }}>Login</span>
              </Button>
            </div>
          ) : (
            <div>
              <Button
                style={{
                  textTransform: "capitalize",
                  fontSize: "120%",
                  background: " #263238",
                  color: "lightgrey",
                }}
                onClick={this.openMenuHandler}
              >
                <AccountCircle />
                <span style={{ paddingLeft: "3%" }}>
                  {" "}
                  {sessionStorage.getItem("firstName")}
                </span>
              </Button>
              <div>
                <Menu
                  className="menuDrop"
                  id="simple-menu"
                  keepMounted
                  open={this.state.menuIsOpen}
                  onClose={this.closeMenuHandler}
                  anchorEl={this.state.anchorEl}
                >
                  <MenuItem onClick={this.handleClose}>
                    <Link
                      to="/profile"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      My Profile
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={this.props.logoutHandler}>Logout</MenuItem>
                </Menu>
              </div>
            </div>
          )}
        </div>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          contentLabel="Login"
          onRequestClose={this.closeModalHandlerClickAway}
          style={customStyles}
        >
          <Tabs
            className="tabs"
            value={this.state.value}
            onChange={this.tabChangeHandler}
          >
            <Tab label="LOGIN" />
            <Tab label="SIGNUP" />
          </Tabs>
          {this.state.value === 0 && (
            <TabContainer>
              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="username"> Contact No. </InputLabel>
                <Input
                  id="username"
                  type="text"
                  username={this.state.username}
                  value={this.state.username}
                  onChange={this.inputUsernameChangeHandler}
                />
                <FormHelperText className={this.state.usernameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
                <Typography variant="subtitle1" color="error" align="left">
                  {this.state.loginInvalidContactNo}
                </Typography>

                {this.state.loginErrCode === "ATH-001" ? (
                  <FormControl className={classes.formControl}>
                    <Typography
                      variant="subtitle1"
                      color="error"
                      className={this.state.loginError}
                      align="left"
                    >
                      {this.state.loginErrorMsg}
                    </Typography>
                  </FormControl>
                ) : (
                  ""
                )}
              </FormControl>
              <br />
              <br />

              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="password"> Password </InputLabel>
                <Input
                  id="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.inputPasswordChangeHandler}
                />
                <FormHelperText className={this.state.passwordRequired}>
                  <span className="red">required</span>
                </FormHelperText>

                {this.state.loginErrCode === "ATH-002" ? (
                  <FormControl className={classes.formControl}>
                    <Typography
                      variant="subtitle1"
                      color="error"
                      className={this.state.loginError}
                      align="left"
                    >
                      {this.state.loginErrorMsg}
                    </Typography>
                  </FormControl>
                ) : (
                  ""
                )}
              </FormControl>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.loginClickHandler}
                className={classes.formControl}
              >
                LOGIN
              </Button>
            </TabContainer>
          )}

          {this.state.value === 1 && (
            <TabContainer>
              <form>
                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="firstName">First Name</InputLabel>
                  <Input
                    id="firstName"
                    type="text"
                    onChange={this.inputFirstNameChangeHandler}
                    value={this.state.firstName}
                  />
                  <FormHelperText className={this.state.firstNameRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />

                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="lastName">Last Name</InputLabel>
                  <Input
                    id="lastName"
                    type="text"
                    onChange={this.inputLastNameChangeHandler}
                    value={this.state.lastName}
                  />
                  <FormHelperText className={this.state.lastNameRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />

                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input
                    id="email"
                    type="email"
                    onChange={this.inputEmailChangeHandler}
                    value={this.state.email}
                  />
                  <FormHelperText className={this.state.emailRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                  {this.state.signUpErrCode === "SGR-002" ? (
                    <FormControl className={classes.formControl}>
                      <Typography
                        variant="subtitle1"
                        color="error"
                        className={this.state.signupError}
                        align="left"
                      >
                        Invalid Email
                      </Typography>
                    </FormControl>
                  ) : (
                    ""
                  )}
                </FormControl>
                <br />
                <br />

                <FormControl
                  required
                  aria-describedby="name-helper-text"
                  className={classes.formControl}
                >
                  <InputLabel htmlFor="passwordReg">Password</InputLabel>
                  <Input
                    type="password"
                    id="passwordReg"
                    value={this.state.passwordReg}
                    onChange={this.inputPasswordRegisterChangeHandler}
                  />
                  <FormHelperText className={this.state.passwordRegRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                  {this.state.signUpErrCode === "SGR-004" ? (
                    <FormControl className={classes.formControl}>
                      <Typography
                        variant="subtitle1"
                        color="error"
                        className={this.state.signupError}
                        align="left"
                      >
                        Password must contain at least one capital letter, one
                        small letter, one number, and one special character
                      </Typography>
                    </FormControl>
                  ) : (
                    ""
                  )}
                </FormControl>
                <br />
                <br />

                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="mobile">Contact No.</InputLabel>
                  <Input
                    id="mobile"
                    type="number"
                    onChange={this.inputMobileChangeHandler}
                    value={this.state.mobile}
                  />
                  <FormHelperText className={this.state.mobileRequired}>
                    <span className="red">required</span>
                  </FormHelperText>

                  {this.state.signUpErrCode === "SGR-003" ? (
                    <FormControl className={classes.formControl}>
                      <Typography
                        variant="subtitle1"
                        color="error"
                        className={this.state.signupError}
                        align="left"
                      >
                        Contact No. must contain only numbers and must be 10
                        digits long
                      </Typography>
                    </FormControl>
                  ) : (
                    ""
                  )}

                  {this.state.signUpErrCode === "SGR-001" ? (
                    <FormControl className={classes.formControl}>
                      <Typography
                        variant="subtitle1"
                        color="error"
                        className={this.state.signupError}
                        align="left"
                      >
                        {this.state.signUpErrorMsg}
                      </Typography>
                    </FormControl>
                  ) : (
                    ""
                  )}
                </FormControl>
                <br />
                <br />
                <br />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.signUpClickHandler}
                  className={classes.formControl}
                >
                  {" "}
                  SIGNUP{" "}
                </Button>
              </form>
            </TabContainer>
          )}
        </Modal>

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackBarClose}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<span id="message-id">{this.state.snackBarText}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleSnackBarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
      
    );
  }
}
export default withStyles(styles)(Header);
