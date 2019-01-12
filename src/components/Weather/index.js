import React, { Component } from "react";

import WeatherDetailsList from "./WeatherDetailsList"
import { fetchWeather, kelvinToCelsius, windDirection, getWeatherEditorial } from "utils/weather";
import wordFilter from "utils/wordFilter";
import { metersSecondToKilometersHour } from "utils/unitConverter";
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
      isNextWeatherShowed: false,
      isCurrWeatherShowed: true,
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
          <span className="title-big">{kelvinToCelsius(obj.main.temp)}</span>°C{" "}
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
            <h3 className="weather__day__subtitle">Détails</h3>
            {data.weather_day.weather && data.weather_day.weather.length > 0 && isCurrWeatherShowed && (
              <WeatherDetailsList weather={data.weather_day} />
            )}
          </React.Fragment>
        )}
        <div className="weather__week">
          <h3>Les 5 prochains jours</h3>
          {data.weather_week && isNextWeatherShowed ? data.weather_week.map(
            (item, index) => (
              <div key={`day-${index}`}>
                <h4 className="list--date">{item.dt_txt}</h4>  
                <p className="list--temperature">T° <span className="value">{kelvinToCelsius(item.main.temp)}°C</span></p>  
                <p className="list--humidity">Humidité <span className="value">{item.main.humidity}%</span></p>  
                <p className="list--sky"><span className="value">{wordFilter(item.weather[0].main)}</span></p> {/* Ajouter une gestion de la liste*/}  
                <p className="list--wind">Vent <span className="value">{metersSecondToKilometersHour(item.wind.speed)}km/h, {windDirection(item.wind.deg)}</span></p> {/* Détecter l'orientation cardinale */}  
              </div>
            )
          ) : "Aucune données pour les 5 prochains jours"}
        </div>
      </div>
    );
  }
}

export default Weather;
