import React, { Component } from "react";
import PropTypes from "prop-types";

import { fetchWeather, kelvinToCelsius, getWeatherEditorial } from "utils/weather";

import WeatherDetailsList from "./WeatherDetailsList";
import NextWeathersList from "./NextWeathersList";
import NextWeathersListItem from "./NextWeathersList/NextWeathersListItem";
import styles from "./index.module.scss";

/**
* Return Title such as "14°C, It's sunny ☀"
*/
const getTitle = obj => {
  if (obj && obj.main && obj.main.temp && obj.weather && obj.weather.length > 0) {
    return (
      <h2>
        <span className="title-big">{kelvinToCelsius(obj.main.temp)}</span>
        <span className="title-small">°C</span>
        {getWeatherEditorial(obj.weather[0]) &&
          <span className="subtitle">{", It's "}{getWeatherEditorial(obj.weather[0]).adj}</span>
        }
        <NextWeathersListItem data={obj} icon />
      </h2>
    );
  }
  return false;
};

class Weather extends Component {
  constructor(props) {
    super(props);

    const { isCurrWeatherShowed, isNextWeatherShowed, lang } = this.props;

    this.state = {
      data: null,
      isCurrWeatherShowed,
      isNextWeatherShowed,
      lang: lang || "fr"
    };
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

  render() {
    const { data, isNextWeatherShowed, isCurrWeatherShowed } = this.state;
    const { style } = this.props;

    if (!data) return <div className={`c-weather ${styles.weather}`} style={{ color: "#fff" }}>La météo est en chargement...</div>;

    return (
      <div
        className={`c-weather ${styles.weather}`}
        style={style}
      >
        {data.weather_day && (
          <React.Fragment>
            {getTitle(data.weather_day)}
            {isCurrWeatherShowed && data.weather_day.weather && data.weather_day.weather.length > 0 && (
              <WeatherDetailsList weather={data.weather_day} />
            )}
          </React.Fragment>
        )}
        {isNextWeatherShowed && data.weather_week && (
          <NextWeathersList reports={data.weather_week} />
        )}
      </div>
    );
  }
}

Weather.propTypes = {
  isCurrWeatherShowed: PropTypes.bool,
  isNextWeatherShowed: PropTypes.bool,
  lang: PropTypes.string,
  style: PropTypes.shape()
};

Weather.defaultProps = {
  isCurrWeatherShowed: false,
  isNextWeatherShowed: false,
  lang: "fr",
  style: {}
};

export default Weather;
