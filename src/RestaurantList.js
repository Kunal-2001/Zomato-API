import React, { Component } from "react";
import Restaurant from "./Restaurant.js";
import "./RestaurantList.css";
import { FaSearch } from "react-icons/fa";

const axios = require("axios").default;

class RestaurantList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 0,
      long: 0,
      value: "",
      restaurants: [],
      showLoader: false,
      invalid: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.restaurants = this.restaurants.bind(this);
  }

  async restaurants() {
    try {
      let lat = this.state.lat;
      let long = this.state.long;
      let rest = [];

      let req = await axios.get(
        "https://developers.zomato.com/api/v2.1/search",
        {
          headers: {
            Accept: "application/json",
            "X-Zomato-API-Key": process.env.REACT_APP_ZOMATO_API_KEY,
          },
          params: {
            start: 0,
            count: this.props.numRestaurantsToFetch,
            lat: lat,
            lon: long,
            sort: "rating",
            order: "desc",
          },
        }
      );
      console.log(req);
      req.data.restaurants.map((item) => {
        const list = item.restaurant;
        // console.log(list);
        rest.push({
          id: list.id,
          avgCost: list.average_cost_for_two,
          currency: list.currency,
          cuisines: list.cuisines,
          onlineDelivery: list.has_online_delivery >= 1 ? true : false,
          menuUrl: list.menu_url,
          address: list.location.address,
          name: list.name,
          url: list.url,
          contact: list.phone_numbers,
          image: list.thumb,
          timings: list.timings,
          rating: list.user_rating.aggregate_rating,
          ratingColor: list.user_rating.rating_color,
        });
        return rest;
      });

      this.setState({
        showLoader: false,
        restaurants: [...this.state.restaurants, ...rest],
      });
    } catch (err) {
      console.log(err);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ restaurants: [], value: "", showLoader: true });
    const location = this.state.value;
    const key = process.env.REACT_APP_GEOCODE_API_KEY;
    try {
      const res = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: location,
            key: key,
          },
        }
      );
      console.log(res);
      if (res.data.results === []) {
        this.setState({ invalid: true });
      } else {
        let latitude = res.data.results[0].geometry.lat;
        let longitude = res.data.results[0].geometry.lng;
        this.setState({ lat: latitude, long: longitude, invalid: false });
      }

      this.restaurants();
    } catch (err) {
      console.log(err);
    }
  }

  handleInputChange(e) {
    let val = e.target.value;
    this.setState({ value: val });
  }

  render() {
    const allRestaurants = this.state.restaurants.map((item) => (
      <Restaurant
        key={item.id}
        avgCost={item.avgCost}
        cuisines={item.cuisines}
        onlineDelivery={item.onlineDelivery}
        address={item.address}
        name={item.name}
        url={item.url}
        menu={item.menuUrl}
        contact={item.contact}
        image={item.image}
        rating={item.rating}
        ratingColor={item.ratingColor}
        timings={item.timings}
        currency={item.currency}
      />
    ));
    return (
      <div>
        <img
          alt="zomato logo"
          className="image"
          src="https://www.indifi.com/blog/wp-content/uploads/2020/02/Good-Reviews-On-Zomato-Improve-Your-Business-1050x290.jpg"
        />
        <div className="container">
          <div className="form">
            <form onSubmit={this.handleSubmit}>
              <div className="inputs">
                <input
                  placeholder="Enter a city name"
                  autoFocus
                  className="form-control location"
                  type="text"
                  value={this.state.value}
                  onChange={this.handleInputChange}
                />
                <button className="btn btn-danger button" type="submit">
                  Search for restaurants
                  <span style={{ marginLeft: "10px" }}>
                    <FaSearch />
                  </span>
                </button>
              </div>
            </form>
          </div>
          {this.state.showLoader && <div className="loader" />}
          {this.state.invalid && <h2>No Results Found</h2>}
          <div className="restaurantList">{allRestaurants}</div>
        </div>
      </div>
    );
  }
}

export default RestaurantList;
