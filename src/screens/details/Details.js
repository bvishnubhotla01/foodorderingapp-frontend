import React, {Component} from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import StarIcon from '@material-ui/icons/Star';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faRupeeSign}  from '@fortawesome/free-solid-svg-icons';

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