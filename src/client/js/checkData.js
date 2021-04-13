const checkInputData = (city, tripStartText, tripStart, today) => {
  let message = "";
  if (city.length === 0) {
    message = "Please enter city's name";
  } else if (!tripStartText) {
    message = "Please enter the date when your trip starts";
  } else if (tripStart < today) {
    message = "Please enter the future date";
  }
  return message;
};

export { checkInputData };
