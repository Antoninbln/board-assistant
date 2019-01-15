import moment from "moment";
import localization from "moment/locale/fr"; // eslint-disable-line

moment.locale("fr", localization);

/**
 * Return current date object
 * @returns { Object<date: String, day: String, hours: String, minutes: String, seconds: String> }
 */
export default function getCurrentDate() {
  return {
    "date": moment().format("D MMM YYYY HH:mm:ss"),
    "day": moment().format("D MMMM YYYY"),
    "hours": moment().format("H"),
    "minutes": moment().format("mm"),
    "seconds": moment().format("ss")
  };
};

/**
 * Return current day
 * @param { Boolean } details 
 * @return { String }
 */
export function getCurrentDay(details = false) {
  if (details) return moment().format("D MMM YYYY");
  return moment().format("D");
};

/**
 * Return hours of a date from milliseconds
 * @param { Integer } ms Date as milliseconds
 * @returns { String } Date such as 8:30
 */
export function getHours(ms, sep = ":") {
  if (!ms) return false;
  return moment.unix(ms).format(`H${sep}mm`);
}
