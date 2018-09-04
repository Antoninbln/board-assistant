/**
 * 
 */
export default (word, lang = "fr") => {
  if (lang !== "fr") {
    // Other languages are coming
    return false;
  }

  switch (word) {
    case "Clouds":
      return "Nuageux";

    case "Clear":
      return "Dégagé";
    
    case "Rain":
      return "Pluie";
    
    case "Extreme":
      return "Tempète";
    
    default: 
      return word;
  }
};
