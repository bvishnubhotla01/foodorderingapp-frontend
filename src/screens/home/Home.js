import React, { Component } from "react";
import Header from "../../common/header/Header";
import { withStyles } from "@material-ui/core/styles";
import "./Home.css";
import * as HelperMethods from "../../common/Helpers";
import * as Constants from "../../common/Constants";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar,  faRupeeSign} from '@fortawesome/free-solid-svg-icons';
import Grid from '@material-ui/core/Grid'; 
import { Link, Redirect } from "react-router-dom";

const styles = {
  card: { width: "90%", cursor: "pointer" },
};

let restaurants = ""
let i = 0;
class Home extends Component {

  constructor(){
    super()
    this.state = {name : '',
   flag : false,
   restaurants : "",
   restaurantId : "",
   searchFlag : false,
   searchRestaurants : ""
  }
  }


  getRestaurants = ()=>{
    let xhr = new XMLHttpRequest();
    let that = this
    xhr.addEventListener("readystatechange", function(){
      if(this.readyState === 4) {
        //console.log(this.responseText)
        restaurants = JSON.parse(this.responseText)
        that.setState({flag : true, restaurants : restaurants })
          
      }
    })

    xhr.open('GET', 'http://localhost:8080/api/restaurant/')
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send()
  }


  
  componentDidMount(){
    let a = this.getRestaurants()
  }

  inputChangeHandler =(e)=>{


    this.setState({searchFlag : true})
    console.log(e.target.value)
    let restaurantName = e.target.value

    let xhr = new XMLHttpRequest();
    let that = this
    if(restaurantName !== "") {
    xhr.addEventListener("readystatechange", function(){
      if(this.readyState === 4) {
        //console.log(this.responseText)
        restaurants = JSON.parse(this.responseText)
        //console.log(restaurants)
        if(restaurants.restaurants !== null) {
        that.setState({flag : true, searchRestaurants : restaurants })
        }
        else{
          that.setState({flag : true, searchRestaurants : "" })
        }
          
      }
    })

    xhr.open('GET', 'http://localhost:8080/api/restaurant/name/' + restaurantName)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send()
  }
    else{
          this.setState({searchFlag : false})
    }
  }

  render() {
    return (
      <div>
        <Header
          showSearch={true}
          history={this.props.history}
          baseUrl={this.props.baseUrl}
          onChange = {this.inputChangeHandler}
        />
       <div className = 'topcontainer'>
         {console.log('From render', this.state.restaurants)}
         
        {this.state.searchFlag === false ? this.state.restaurants != ""  ? this.state.restaurants.restaurants.map((restaurant)=>(
         
            <div className = 'cardcontainer' key = {i++}>
              <Link to = {"/restaurant/" + restaurant.id} style={{ textDecoration: 'none' }}> <Card>
      <CardActionArea>
        <CardMedia
          image={restaurant.photo_URL} style = {{height : '400px', width : '400px'}}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {restaurant.restaurant_name}
          </Typography>
      
          <Typography variant="body2" color="textSecondary" component="p">
           {restaurant.categories}
          </Typography>
          <div style = {{marginTop : '3%', display : 'flex', flexDirection : 'row'}}>
            <div><span style = {{backgroundColor : 'gold', color : 'white'}}><FontAwesomeIcon icon={faStar} />    
                {restaurant.customer_rating}    ({restaurant.number_customers_rated})</span>
            </div>
            <div style = {{marginLeft : '55%'}}>  <FontAwesomeIcon icon = {faRupeeSign} />{restaurant.average_price}      for two
            </div>
          </div>
        </CardContent>
      </CardActionArea>
      </Card>
      </Link>
              </div>
          )) :this.state.flag?this.setState({name : 'pqr'}):"" :this.state.searchRestaurants!==""  ? this.state.searchRestaurants.restaurants.map((restaurant)=>(
         
            <div className = 'cardcontainer' key = {i++}>
              <Link to = {"/restaurant/" + restaurant.id} style={{ textDecoration: 'none' }}> <Card>
      <CardActionArea>
        <CardMedia
          image={restaurant.photo_URL} style = {{height : '400px', width : '400px'}}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {restaurant.restaurant_name}
          </Typography>
      
          <Typography variant="body2" color="textSecondary" component="p">
           {restaurant.categories}
          </Typography>
          <div style = {{marginTop : '3%', display : 'flex', flexDirection : 'row'}}>
            <div><span style = {{backgroundColor : 'gold', color : 'white'}}><FontAwesomeIcon icon={faStar} />    
                {restaurant.customer_rating}    ({restaurant.number_customers_rated})</span>
            </div>
            <div style = {{marginLeft : '55%'}}>  <FontAwesomeIcon icon = {faRupeeSign} />{restaurant.average_price}      for two
            </div>
          </div>
        </CardContent>
      </CardActionArea>
      </Card>
      </Link>
              </div>)):""}
       </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
