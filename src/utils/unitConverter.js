/**
 * Convert distance from METERS to KILOMETERS
 * @param { Int } meters 
 */
export const metersToKilometers = meters => {
  const kmRatio = 1000;
  return meters/kmRatio;
};

/**
 * Convert distance from MILES to KILOMETERS
 * @param { Int } miles
 */
export const milesToKilometers = miles => {
  const kmRatio = 1.60934;
  return Math.round(miles/kmRatio*100)/100;;
};

/**
 * Convert duration from SECONDS to HOURS
 * @param { Int } seconds 
 */
export const secondsToHours = seconds => {
  const hourRatio = 3600;
  return seconds/hourRatio;
};

/**
 * Convert M/S to KM/S
 * @param { Int } lowUnitSpeed 
 */
export const metersSecondToKilometersHour = lowUnitSpeed => Math.round(metersToKilometers(lowUnitSpeed)/secondsToHours(1));
