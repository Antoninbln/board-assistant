import moment from "moment";
import localization from "moment/locale/fr"; // eslint-disable-line

moment.locale("fr", localization);

export default function getCurrentDate() {
  return {
    "date": moment().format("DD MMM YYYY HH:mm:ss"),
    "day": moment().format("DD MMM YYYY"),
    "hours": moment().format("HH"),
    "minutes": moment().format("mm"),
    "seconds": moment().format("ss")
  };
}

export function getCurrentDay(details = false) {
  if (details) return moment().format("DD MMM YYYY");
  return moment().format("DD");
}
