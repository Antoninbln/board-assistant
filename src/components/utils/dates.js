import moment from "moment";
import localization from "moment/locale/fr"; // eslint-disable-line

moment.locale("fr", localization);

export default function getCurrentDate() {
  return moment().format("DD MMM YYYY HH:mm:ss");
}

export function getCurrentDay(details = false) {
  if (details) return moment().format("DD MMM YYYY");
  return moment().format("DD");
}
