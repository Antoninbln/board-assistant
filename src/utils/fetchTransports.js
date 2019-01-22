const baseUrl = "https://api-ratp.pierre-grimaud.fr/v3/schedules/bus/";

export const fetchBus = ( busLine = 122, station = "", sens = "A") => {
  if (!busLine || !station || !sens) return {};
  return fetch(`${baseUrl}${busLine}/${station}/${sens}`)
    .then(res => res.json())
    .then(data => data.result.schedules)
    .catch(err => console.log("Error", err));
};

export default { fetchBus };
