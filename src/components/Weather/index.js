import React, { Component } from "react";

import { fetchWeather, kelvinToCelsius, windDirection } from "../utils/weather";
import wordFilter from "../utils/wordFilter";
import { metersSecondToKilometersHour } from "../utils/unitConverter";
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
      data: {},
      isNextWeatherShowed: false,
      isCurrWeatherShowed: false,
      lang: this.props.lang || "fr"
    }
  }

  componentDidMount() {
    const { lang } = this.state;

    const weather = fetchWeather(lang)
      .then(res => {
        console.log("RESULTS", res);
        const weather_day = res.list;
        const weather_week = res.list.shift(); // Remove first element

        this.setState({
          data: {
            city: weather.city,
            weather_day,
            weather_week
          }
        }, () => console.log("DATA LOADED"))
      }
    );
  }


  render() {
    const { data, isNextWeatherShowed, isCurrWeatherShowed } = this.state;
    console.log("Data", data);

    if (!data.length > 0) return <div className={`c-weather ${styles.weather}`} style={{ color: "#fff" }}>La météo est en chargement...</div>;

    return (
      <div className={`c-weather ${styles.weather}`}>
        <h2>{data.city.name}, {data.city.country}</h2>
        {data.weather_day && isCurrWeatherShowed && (
          <div className="weather__day">
            {data.weather_week ? data.weather_week.map(
              (item, index) => (
                <div key={`day-${index}`}>
                  <h4 className="list--date">{item.dt_txt}</h4>  
                  <p className="list--temperature">T° <span className="value">{kelvinToCelsius(item.main.temp)}°C</span></p>  
                  <p className="list--humidity">Humidité <span className="value">{item.main.humidity}%</span></p>  
                  <p className="list--sky"><span className="value">{wordFilter(item.weather[0].main)}</span></p> {/* Ajouter une gestion de la liste*/}  
                  <p className="list--wind">Vent <span className="value">{metersSecondToKilometersHour(item.wind.speed)}km/h, {windDirection(item.wind.deg)}</span></p> Détecter l'orientation cardinale  
                </div>
              )
            ) : "Aucune données pour les 5 prochains jours"}
          </div>
        )}
        <div className="weather__week">
          <h3>Les 5 prochains jours</h3>
          {data.weather_week ? data.weather_week.map(
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
