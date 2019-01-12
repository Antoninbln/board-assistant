export const metersToKilometers = meters => {
  const kmRatio = 1000;
  return meters/kmRatio;
};

export const milesToKilometers = miles => {
  const kmRatio = 1.60934;
  return Math.round(miles/kmRatio*100)/100;;
};

export const secondsToHours = seconds => {
  const hourRatio = 3600;
  return seconds/hourRatio;
};

export const metersSecondToKilometersHour = lowUnitSpeed => {
  return Math.round(metersToKilometers(lowUnitSpeed)/secondsToHours(1));
};
