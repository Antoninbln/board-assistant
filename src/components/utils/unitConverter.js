export const metersToKilometers = meters => {
  const kmRatio = 1000;
  return meters/kmRatio;
};

export const secondsToHours = seconds => {
  const hourRatio = 3600;
  return seconds/hourRatio;
};

export const metersSecondToKilometersHour = lowUnitSpeed => {
  return Math.round(metersToKilometers(lowUnitSpeed)/secondsToHours(1));
};
