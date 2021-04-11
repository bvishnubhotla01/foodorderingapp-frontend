import React, { Component } from "react";
import "./Details.css";
import Header from "../../common/header/Header";
import StarIcon from "@material-ui/icons/Star";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRupeeSign,
  faCircle,
  faStopCircle,
} from "@fortawesome/free-solid-svg-icons";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Add from "@material-ui/icons/Add";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Badge from "@material-ui/core/Badge";

class Details extends Component {
  constructor() {
    super();
    this.state = {
      restaurantData: {},
      locality: "",
      categoriesList: [],
      totalNumberOfItems: 0,
      totalPrice: 0,
      addedItemsList: [],
      successMessage: "",
      showMessage: false,
    };
  }
  componentDidMount() {
    this.getRestaurantDetails();
  }
  getRestaurantDetails = () => {
    let restaurantId = this.props.match.params.id;
    return fetch(`${this.props.baseUrl}restaurant/${restaurantId}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          restaurantData: data,
          locality: data.address.locality,
          categoriesList: data.categories,
        });
      })
      .catch((error) => console.log("error", error));
  };
  getRestaurantCategories = () => {
    const categories = this.state.categoriesList;
    var categoriesString = "";
    for (var i = 0; i < categories.length; i++) {
      if (i === categories.length - 1) {
        categoriesString += categories[i].category_name;
      } else {
        categoriesString += categories[i].category_name + ", ";
      }
    }
    return categoriesString;
  };
  addingItemIntoCart = (item, showMsg) => {
    let itemList = this.state.addedItemsList.slice();
    let found = false;
    if (itemList.length !== 0 || !itemList != null) {
      for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].id === item.id) {
          found = true;
          itemList[i].quantity = itemList[i].quantity + 1;
          break;
        }
      }
    }
    if (found === false) {
      var item_detail = {};
      item_detail.id = item.id;
      item_detail.item_name = item.item_name;
      item_detail.price = item.price;
      item_detail.item_type = item.item_type;
      item_detail.quantity = 1;
      itemList.push(item_detail);
    }
    let message = "Item quantity increased by 1";
    if (showMsg === true) {
      this.setState({
        successMessage: message,
        showMessage: true,
      });
    }

    // Calculate Quantity and Total Price...
    var totalQuantity = 0;
    var totalAmount = 0;
    for (let i of itemList) {
      totalQuantity += i.quantity;
      totalAmount += i.quantity * i.price;
    }

    this.setState({
      addedItemsList: itemList,
      totalNumberOfItems: totalQuantity,
      totalPrice: totalAmount,
    });
  };
  increaseQtyHandler = (item) => {
    this.addingItemIntoCart(item, true);
  };
  decreaseQtyHandler = (item) => {
    let itemList = this.state.addedItemsList.slice();
    if (itemList.length !== 0 || !itemList != null) {
      for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].id === item.id) {
          if (itemList[i].quantity > 1) {
            itemList[i].quantity = itemList[i].quantity - 1;
            var message = "Item quantity decreased by 1!";
            this.setState({
              addedItemsList: itemList,
              successMessage: message,
              showMessage: true,
            });
            break;
          } else {
            itemList.splice(i, 1);
            message = "Item removed from cart!";
            this.setState({
              addedItemsList: itemList,
              successMessage: message,
              showMessage: true,
            });

            break;
          }
        }
      }
    }
    var totalQuantity = 0;
    var totalAmount = 0;
    for (let object of itemList) {
      totalQuantity += object.quantity;
      totalAmount += object.quantity * object.price;
    }
    this.setState({
      totalNumberOfItems: totalQuantity,
      totalPrice: totalAmount,
    });
  };
  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ showMessage: false });
  };
  checkoutHandler = () => {
    if (this.state.addedItemsList.length === 0) {
      this.setState({
        showMessage: true,
        successMessage: "Please add an item to your cart!",
      });
    } else {
      // Check for Customer logged in or not ....
      var token = sessionStorage.getItem("access-token");
      if (token === null || token === "" || token === undefined) {
        this.setState({
          showMessage: true,
          successMessage: "Please login first!",
        });
      } else {
        this.props.history.push({
          pathname: "/checkout",
          restaurant_id: this.props.match.params.id,
          restaurant_name: this.state.restaurantData.restaurant_name,
          itemList: this.state.addedItemsList,
          totalAmount: this.state.totalPrice,
        });
      }
    }
  };
  logoutHandler = () => {
    sessionStorage.clear();
    this.props.history.push({
      pathname: "/",
    });
    window.location.reload();
  };

  render() {
    return (
      <div>
        <div className="headerContainer">
          <Header
            logOutClickHandler={this.logoutHandler}
            baseUrl={this.props.baseUrl}
          />
        </div>
        <div className="restaurantDetailsContainer">
          <div className="imgContainer">
            <img src={this.state.restaurantData.photo_URL} alt="Restaurant" />
          </div>

          <div className="detailsContainer">
            <div className="details">
              <div className="mainInfo">
                <h3>{this.state.restaurantData.restaurant_name}</h3>
                <h4>{this.state.locality.toUpperCase()}</h4>
                <p>{this.getRestaurantCategories()}</p>
              </div>
              <div className="additionalInfo">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <StarIcon />
                        {this.state.restaurantData.customer_rating}
                      </td>
                      <td>
                        <FontAwesomeIcon icon={faRupeeSign} />{" "}
                        {this.state.restaurantData.average_price}
                      </td>
                    </tr>
                    <tr className="gray-small">
                      <td>AVERAGE RATING BY</td>
                      <td>AVERAGE COST FOR</td>
                    </tr>
                    <tr className="gray-small">
                      <td>
                        <b>
                          {this.state.restaurantData.number_customers_rated}
                        </b>{" "}
                        CUSTOMERS
                      </td>
                      <td>TWO PEOPLE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="menuItemsContainer">
          <div className="menu">
            <div id="categoryItems">
              {this.state.categoriesList.map((category) => (
                <div key={"category-" + category.id}>
                  <div className="category-name-container">
                    {category.category_name}
                  </div>
                  <div className="divider-line">
                    <Divider variant="fullWidth" />
                  </div>
                  {category.item_list.map((item) => (
                    <div className="item-container" key={"item-" + item.id}>
                      <span className="item-info">
                        {item.item_type === "NON_VEG" && (
                          <FontAwesomeIcon
                            icon={faCircle}
                            className="non-veg"
                          />
                        )}
                        {item.item_type === "VEG" && (
                          <FontAwesomeIcon icon={faCircle} className="veg" />
                        )}
                        {item.item_name}
                      </span>
                      <div className="price-info">
                        <span className="spacing">
                          <FontAwesomeIcon icon={faRupeeSign} />
                          {parseFloat(
                            Math.round(item.price * 100) / 100
                          ).toFixed(2)}
                        </span>
                      </div>

                      <IconButton
                        onClick={this.addingItemIntoCart.bind(
                          this,
                          item,
                          false
                        )}
                      >
                        <Add />
                      </IconButton>

                      <br />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="cart-container">
            <Card>
              <CardContent>
                <div>
                  <Badge
                    badgeContent={this.state.totalNumberOfItems}
                    color="primary"
                    invisible={false}
                  >
                    <ShoppingCart />
                  </Badge>
                  <span className="my-cart"> My Cart</span>
                </div>
                {this.state.addedItemsList.map((item, index) => (
                  <div className="item-list" key={index}>
                    {item.item_type === "NON_VEG" && (
                      <FontAwesomeIcon
                        icon={faStopCircle}
                        className="non-veg"
                      />
                    )}
                    {item.item_type === "VEG" && (
                      <FontAwesomeIcon icon={faStopCircle} className="veg" />
                    )}
                    <span className="added-item-name"> {item.item_name} </span>
                    <button
                      className="button-size"
                      onClick={this.decreaseQtyHandler.bind(this, item)}
                    >
                      {" "}
                      -{" "}
                    </button>
                    <span className="quantity-label"> {item.quantity} </span>
                    <button
                      className="button-size"
                      onClick={this.increaseQtyHandler.bind(this, item)}
                    >
                      {" "}
                      +{" "}
                    </button>
                    <span className="price-label">
                      {" "}
                      <FontAwesomeIcon icon={faRupeeSign} />
                      {parseFloat(
                        Math.round(item.price * item.quantity * 100) / 100
                      ).toFixed(2)}{" "}
                    </span>
                  </div>
                ))}
                <div className="total-amount-section">
                  <span> TOTAL AMOUNT </span>
                  <span className="total-amount">
                    {" "}
                    <FontAwesomeIcon icon={faRupeeSign} />
                    {parseFloat(
                      Math.round(this.state.totalPrice * 100) / 100
                    ).toFixed(2)}{" "}
                  </span>
                </div>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={true}
                  onClick={this.checkoutHandler}
                >
                  CHECKOUT
                </Button>
              </CardActions>
            </Card>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.showMessage}
          onClose={this.handleClose}
          autoHideDuration={2000}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<span id="message-id"> {this.state.successMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default Details;
