const baseUrl = "https://api-ratp.pierre-grimaud.fr/v3/schedules/bus/";

// export const fetchBus = (busLine = 122, station = "parc+de+montreau", sens = "A") => {
export const fetchBus = (services=[]) => Promise.all(
  services.map(service => {
    if (!service.id || !service.station || !service.direction) return;
    
    const serviceData = { id: service.id, station: service.station, direction: service.direction };

    // eslint-disable-next-line consistent-return
    return fetch(`${baseUrl}${service.id}/${service.station}/${service.direction}`)
      .then(res => res.json())
      .then(data => Promise.resolve({ ...serviceData, schedules: data.result.schedules }))
      .catch(err => console.error("Error", err));
  })
).then(val => val);

export default { fetchBus };
