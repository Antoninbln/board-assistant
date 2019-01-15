const baseUrl = "http://api.openweathermap.org/data/2.5";
const apiKey = "&APPID=e3ec2876f020b69df62826855fe1bf38";

/**
 * 
 * @param {*} lang 
 */
export const fetchWeather = (lang) => {
  return fetch(`${baseUrl}/forecast?q=Montreuil,fr${apiKey}&lang=${lang}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data;
    })
    .catch(err => console.log("Error", err));
};

/**
 * 
 * @param {*} val 
 */
export const kelvinToCelsius = val => {
  const kelvinUnit = 273.15;
  return Math.round((val - kelvinUnit) * 10)/10;
};

/**
 * 
 * @param {*} val 
 */
export const windDirection = (val, details = false) => {
  const directions = details ? (
    ["Nord", "Nord Est", "Est", "Sud Est", "Sud" , "Sud Ouest", "Ouest", "Nord Ouest"]
  ) : (
    ["N", "NE", "E", "SE", "S" , "SO", "O", "NO"]
  );
  const max = 360;
  const ratio = max / directions.length; // 8

  if (Math.round(val / ratio) - 1 < 0) return directions[0];
  return directions[Math.round(val / ratio) - 1];
};

/**
 * 
 */
export const convertTemp = val => (val - 32) / 1.8;

export const getWeatherEditorial = weather => {
  switch(weather.main) {
    case "Clouds":
      return { icon: "", adj: "cloudy", decription: `${weather.description.charAt(0).toUpperCase()}` };
    
    default:
      return false;
  }
}
