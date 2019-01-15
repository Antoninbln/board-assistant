const baseUrl = "https://api-ratp.pierre-grimaud.fr/v3/schedules/bus/";

export const fetchBus = ( busLine = 122, station = "", sens = "A") => {
  if (!busLine || !station || !sens) return {};
  return fetch(`${baseUrl}${busLine}/${station}/${sens}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log("on return", data.result.schedules);
      return data.result.schedules;
    })
    .catch(err => console.log("Error", err));
};
