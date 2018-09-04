const baseUrl = "http://api.openweathermap.org/data/2.5";
const apiKey = "&APPID=e3ec2876f020b69df62826855fe1bf38";

export const fetchWeather = (lang) => {

  console.log(`${baseUrl}/forecast?q=Montreuil,fr${apiKey}`);

  return fetch(`${baseUrl}/forecast?q=Montreuil,fr${apiKey}&lang=${lang}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log("on return");
      return data;
    })
    .catch(err => console.log("Error", err));
};

export const kelvinToCelsius = val => {
  const kelvinUnit = 273.15;
  return Math.round((val - kelvinUnit) * 10)/10;
};

export const windDirection = val => {
  const directions = ["Nord", "Nord Est", "Est", "Sud Est", "Sud" , "Sud Ouest", "Ouest", "Nord Ouest"];
  const max = 360;
  const ratio = max / directions.length; // 8

  if (Math.round(val / ratio) - 1 < 0) return directions[0];
  return directions[Math.round(val / ratio) - 1];
}
