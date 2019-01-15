import cloudSnowIcon from "./assets/icon-cloud-snow.svg";
import cloudIcon from "./assets/icon-cloud.svg";
import moonIcon from "./assets/icon-moon.svg";
import sunIcon from "./assets/icon-sun.svg";
import snowIcon from "./assets/icon-snow.svg";
import rainIcon from "./assets/icon-rain.svg";
import stormIcon from "./assets/icon-storm.svg";

/**
 * Return template of weather details (only for visual objects)
 * @param { Object } obj From API weather
 * @return { ArrayOf<Object> } Array of items to display
 */
export const getTemplate = weather => {
  if (!(weather.weather && weather.weather[0] && weather.weather[0].id)) return false;

  const template = icons.filter(item => item.id == weather.weather[0].id)[0]; // We take the first 1 because it can returns more, and find() returns a reference

  // If we have more than 1 icon && icon send by API exists
  if (template.length > 0 && template[0].icon && template[0].icon.length > 1) {
    if (weather.weather[0].icon && template.icon.length > 1)
      template.icon = weather.weather[0].icon.indexOf("n") < 0 ? template.icon[0] : template.icon[1]; // Use icon from API
  }

  return template;
};

const icons = [
  {
    id: 200,
    description: "thunderstorm with light rain",
    iconId: "11d",
    icon: [stormIcon],
    state: "storm"
  }, {
    id: 201,
    description: "thunderstorm with rain",
    iconId: "11d",
    icon: [stormIcon],
    state: "storm"
  }, {
    id: 202,
    description: "thunderstorm with heavy rain",
    iconId: "11d",
    icon: [stormIcon],
    state: "storm"
  }, {
    id: 210,
    description: "light thunderstorm",
    iconId: "11d",
    icon: [stormIcon],
    state: "storm"
  }, {
    id: 211,
    description: "thunderstorm",
    iconId: "11d",
    icon: [stormIcon],
    state: "storm"
  }, {
    id: 212,
    description: "heavy thunderstorm",
    iconId: "11d",
    icon: [stormIcon],
    state: "storm"
  }, {
    id: 221,
    description: "ragged thunderstorm",
    iconId: "11d",
    icon: [stormIcon],
    state: "storm"
  }, {
    id: 230,
    description: "thunderstorm with light drizzle",
    iconId: "11d",
    icon: [stormIcon],
    state: "storm"
  }, {
    id: 231,
    description: "thunderstorm with drizzle",
    iconId: "11d",
    icon: [stormIcon],
    state: "storm"
  }, {
    id: 232,
    description: "thunderstorm with heavy drizzle",
    iconId: "11d",
    icon: [stormIcon],
    state: "storm"
  }, {
    id: 300,
    description:	"light intensity drizzle",
    iconId: "09d",
    icon: [rainIcon],
    state: "drizzle"
  }, {
    id: 301,
    description:	"drizzle",
    iconId: "09d",
    icon: [rainIcon],
    state: "drizzle"
  }, {
    id: 302,
    description:	"heavy intensity drizzle",
    iconId: "09d",
    icon: [rainIcon],
    state: "drizzle"
  }, {
    id: 310,
    description:	"light intensity drizzle rain",
    iconId: "09d",
    icon: [rainIcon],
    state: "drizzle"
  }, {
    id: 311,
    description:	"drizzle rain",
    iconId: "09d",
    icon: [rainIcon],
    state: "drizzle"
  }, {
    id: 312,
    description:	"heavy intensity drizzle rain",
    iconId: "09d",
    icon: [rainIcon],
    state: "drizzle"
  }, {
    id: 313,
    description:	"shower rain and drizzle",
    iconId: "09d",
    icon: [rainIcon],
    state: "drizzle"
  }, {
    id: 314,
    description:	"heavy shower rain and drizzle",
    iconId: "09d",
    icon: [rainIcon],
    state: "drizzle"
  }, {
    id: 321,
    description:	"shower drizzle",
    iconId: "09d",
    icon: [rainIcon],
    state: "drizzle"
  }, {
    id: 500,
    description: "light rain",
    iconId: "10d",
    icon: [rainIcon],
    state: "rain"
  }, {
    id: 501,
    description: "moderate rain",
    iconId: "10d",
    icon: [rainIcon],
    state: "rain"
  }, {
    id: 502,
    description: "heavy intensity rain",
    iconId: "10d",
    icon: [rainIcon],
    state: "rain"
  }, {
    id: 503,
    description: "very heavy rain",
    iconId: "10d",
    icon: [rainIcon],
    state: "rain"
  }, {
    id: 504,
    description: "extreme rain",
    iconId: "10d",
    icon: [rainIcon],
    state: "rain"
  }, {
    id: 511,
    description: "freezing rain",
    iconId: "13d",
    icon: [rainIcon],
    state: "rain"
  }, {
    id: 520,
    description: "light intensity shower rain",
    iconId: "09d",
    icon: [rainIcon],
    state: "rain"
  }, {
    id: 521,
    description: "shower rain",
    iconId: "09d",
    icon: [rainIcon],
    state: "rain"
  }, {
    id: 522,
    description: "heavy intensity shower rain",
    iconId: "09d",
    icon: [rainIcon],
    state: "rain"
  }, {
    id: 531,
    description: "ragged shower rain",
    iconId: "09d",
    icon: [rainIcon],
    state: "rain"
  }, {
    id: 600,
    description: "light snow",
    iconId: "13d",
    icon: [snowIcon],
    state: "snow"
  }, {
    id: 601,
    description: "snow",
    iconId: "13d",
    icon: [snowIcon],
    state: "snow"
  }, {
    id: 602,
    description: "heavy snow",
    iconId: "13d",
    icon: [snowIcon],
    state: "snow"
  }, {
    id: 611,
    description: "sleet",
    iconId: "13d",
    icon: [cloudSnowIcon],
    state: "snow"
  }, {
    id: 612,
    description: "shower sleet",
    iconId: "13d",
    icon: [cloudSnowIcon],
    state: "snow"
  }, {
    id: 615,
    description: "light rain and snow",
    iconId: "13d",
    icon: [cloudSnowIcon],
    state: "snow"
  }, {
    id: 616,
    description: "rain and snow",
    iconId: "13d",
    icon: [cloudSnowIcon],
    state: "snow"
  }, {
    id: 620,
    description: "light shower snow",
    iconId: "13d",
    icon: [snowIcon],
    state: "snow"
  }, {
    id: 621,
    description: "shower snow",
    iconId: "13d",
    icon: [snowIcon],
    state: "snow"
  }, {
    id: 622,
    description: "heavy shower snow",
    iconId: "13d",
    icon: [snowIcon],
    state: "snow"
  }, {
    id: 701,
    description: "mist",
    iconId: "50d",
    icon: [cloudIcon],
    state: "atmosphere"
  }, {
    id: 711,
    description: "smoke",
    iconId: "50d",
    icon: [cloudIcon],
    state: "atmosphere"
  }, {
    id: 721,
    description: "haze",
    iconId: "50d",
    icon: [cloudIcon],
    state: "atmosphere"
  }, {
    id: 731,
    description: "sand, dust whirls",
    iconId: "50d",
    icon: [cloudIcon],
    state: "atmosphere"
  }, {
    id: 741,
    description: "fog",
    iconId: "50d",
    icon: [cloudIcon],
    state: "atmosphere"
  }, {
    id: 751,
    description: "sand",
    iconId: "50d",
    icon: [cloudIcon],
    state: "atmosphere"
  }, {
    id: 761,
    description: "dust",
    iconId: "50d",
    icon: [cloudIcon],
    state: "atmosphere"
  }, {
    id: 762,
    description: "volcanic ash",
    iconId: "50d",
    icon: [cloudIcon],
    state: "atmosphere"
  }, {
    id: 771,
    description: "squalls",
    iconId: "50d",
    icon: [cloudIcon],
    state: "atmosphere"
  }, {
    id: 781,
    description: "tornado",
    iconId:	 "50d",
    icon: [cloudIcon],
    state: "atmosphere"
  }, {
    id: 800,
    description: "clear sky",
    iconId: ["01d", "01n"],
    icon: [sunIcon, moonIcon],
    state: "clear"
  }, {
    id: 801,
    description: "few clouds",
    iconId: ["02d", "02n"],
    icon: [cloudIcon],
    state: "cloudy"
  }, {
    id: 802,
    description: "scattered clouds",
    iconId: ["03d", "03n"],
    icon: [cloudIcon],
    state: "cloudy"
  }, {
    id: 803,
    description: "broken clouds",
    iconId: ["04d", "04n"],
    icon: [cloudIcon],
    state: "cloudy"
  }, {
    id: 804,
    description: "much clouds",
    iconId: ["04d", "04n"],
    icon: [cloudIcon],
    state: "cloudy"
  }
];
