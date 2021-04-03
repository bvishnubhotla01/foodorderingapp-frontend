import React, {Component} from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import StarIcon from '@material-ui/icons/Star';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faRupeeSign, faCircle}  from '@fortawesome/free-solid-svg-icons';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Add from '@material-ui/icons/Add';

class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurantData: {},
            locality: "",
            categoriesList: []
        }
    }
    componentDidMount() {
        this.getRestaurantDetails();
    }
    
render() {
    return (
        <div>

            <div className="headerContainer">
            <Header />
            </div>
            <div className="restaurantDetailsContainer">
                <div className = "imgContainer">
                    <img src={this.state.restaurantData.photo_URL} alt="Restaurant"/>
                </div>
                
                <div className = "detailsContainer">
                    <div className = "details">
                        <div className = "mainInfo">
                            <h3>{this.state.restaurantData.restaurant_name}</h3>
                            <h4>{(this.state.locality).toUpperCase()}</h4>
                            <p>{this.getRestaurantCategories()}</p>
                        </div>
                        <div className = "additionalInfo">
                            <table>
                                <tbody>
                                    <tr>
                                        <td><StarIcon/>{this.state.restaurantData.customer_rating}</td>
                                        <td><FontAwesomeIcon icon={faRupeeSign}/> {this.state.restaurantData.average_price}</td>
                                    </tr>
                                    <tr>
                                        <td>AVERAGE RATING BY</td>
                                        <td>AVERAGE COST FOR</td>
                                    </tr>
                                    <tr>
                                        <td>{this.state.restaurantData.number_customers_rated} CUSTOMERS</td>
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
                    <Card>  
                        <CardContent id="categoryItems">
                            { this.state.categoriesList.map(category => (
                            <div key={"category-"+category.id}>
                                <div className="category-name-container">
                                    {category.category_name}
                                </div>
                                <div className="divider-line">
                                    <Divider variant='fullWidth'/>
                                </div>
                                {category.item_list.map(item => (
                                    <div className="item-container" key={"item-"+item.id}>
                                        <span className="item-info">
                                            {
                                                item.item_type === "NON_VEG" && 
                                                <FontAwesomeIcon icon={faCircle} className="non-veg"/>
                                            }
                                            {
                                                 item.item_type === "VEG" && 
                                                 <FontAwesomeIcon icon={faCircle} className="veg"/>
                                            }
                                            {(item.item_name)}
                                        </span>
                                        <div className="price-info">
                                             <span className="spacing">
                                                <FontAwesomeIcon icon={faRupeeSign}/>{parseFloat(Math.round(item.price * 100) / 100).toFixed(2)}
                                            </span> 
                                        </div>
                                        <IconButton>
                                                 <Add />
                                        </IconButton>
                                        <br/>
                                    </div>
                                 ))
                                }
                            </div>
                        ))}
                        </CardContent>             
                    </Card>
                </div>
                <div className="cart">
                    <h3>Cart PlaceHolder</h3>
                </div>

            </div>

                 
            
        </div>
    )
}
getRestaurantDetails = () => {
    let restaurantId = "246165d2-a238-11e8-9077-720006ceb890";
    return fetch(`http://localhost:8080/api/restaurant/${restaurantId}`)
    .then(response => response.json())
    .then(data => {
        this.setState({
            restaurantData: data,
            locality: data.address.locality,
            categoriesList: data.categories
        })
        console.log(this.state.categoriesList);
    })
    .catch((error) => console.log("error", error)) 
}
getRestaurantCategories = () => {
    const categories = this.state.categoriesList;
    var categoriesString = "";
    for (var i=0; i<categories.length; i++) {
        if (i === categories.length-1) {
            categoriesString += categories[i].category_name    
        } else {
        categoriesString += categories[i].category_name + ", ";
        }
    }
    return categoriesString;
}
}

export default Details;