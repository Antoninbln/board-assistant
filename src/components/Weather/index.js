import React, { Component } from "react";

import { fetchWeather, kelvinToCelsius, getWeatherEditorial } from "utils/weather";

import WeatherDetailsList from "./WeatherDetailsList"
import NextWeathersList from "./NextWeathersList";
import styles from "./index.module.scss";


// @TODO : => Antonin (doc : https://openweathermap.org/forecast5)
// - Ajouter les bons formatq de date
// - Ajouter des icones en fonction des ciels
// - Ajouter les cas où on a  un list.rain
// - Ajouter les cas où on a  un list.snow
// - N'afficher que les 3 premiers
// - Styliser le tout

class Weather extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      isCurrWeatherShowed: true,
      isNextWeatherShowed: true,
      lang: this.props.lang || "fr"
    }

    this.getTitle = this.getTitle.bind(this);
  }

  componentDidMount() {
    const { lang } = this.state;

    fetchWeather(lang)
      .then(res =>
        this.setState({
          data: {
            city: res.city,
            weather_day: res.list.shift(),
            weather_week: res.list // Remove first element
          }
        })
      );
  }

  /**
   * 
   */
  getTitle(obj) {
    console.log("OBJ", obj, getWeatherEditorial(obj.weather[0]));
    if (obj && obj.main && obj.main.temp && obj.weather && obj.weather.length > 0) {
      return (
        <h2>
          <span className="title-big">{kelvinToCelsius(obj.main.temp)}</span>
          <span className="title-small">°C</span>
          <span className="subtitle">, It's sunny.</span>
          {obj.weather[0] && getWeatherEditorial(obj.weather[0]) &&
            <span className="subtitle">It's {getWeatherEditorial(obj.weather[0]).adj}</span>
          }
        </h2>
      );
    }
    else return false;
  }

  render() {
    const { data, isNextWeatherShowed, isCurrWeatherShowed } = this.state;
    console.log("Data", data);

    if (!data) return <div className={`c-weather ${styles.weather}`} style={{ color: "#fff" }}>La météo est en chargement...</div>;

    return (
      <div className={`c-weather ${styles.weather}`}>
        {data.weather_day && (
          <React.Fragment>
            {this.getTitle(data.weather_day)}
            {data.weather_day.weather && data.weather_day.weather.length > 0 && isCurrWeatherShowed && (
              <WeatherDetailsList weather={data.weather_day} />
            )}
          </React.Fragment>
        )}
        {data.weather_week && isNextWeatherShowed && (
          <NextWeathersList reports={data.weather_week} />
        )}
      </div>
    );
  }
}

export default Weather;
