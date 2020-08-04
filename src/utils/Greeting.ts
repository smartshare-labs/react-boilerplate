import moment from "moment-timezone";

export const getGreetingTime = () => {
  const currentTime = moment();
  if (!currentTime || !currentTime.isValid()) {
    return "Hello";
  }

  const splitAfternoon = 12; // 24hr time to split the afternoon
  const splitEvening = 17; // 24hr time to split the evening
  const currentHour = parseFloat(currentTime.format("HH"));

  if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
    // Between 12 PM and 5PM
    return "Good Afternoon";
  } else if (currentHour >= splitEvening) {
    // Between 5PM and Midnight
    return "Good Evening";
  }
  // Between dawn and noon
  return "Good Morning";
};
