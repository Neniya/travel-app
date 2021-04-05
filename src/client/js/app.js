/* Global Variables */
// openweather url address
const baseURL = "http://api.geonames.org/searchJSON?q=";
const baseWeatherbitURL = "https://api.weatherbit.io/v2.0/";
const basePixabayURL = "https://pixabay.com/api/?key=";

let apiKeys = {};
// Create a new date instance dynamically with JS
let d = new Date();
let strMonth = String(d.getMonth() + 1);
// Format dd.mm.yyyy
let newDate =
  d.getDate() +
  "." +
  (strMonth.length == 1 ? "0" + strMonth : strMonth) +
  "." +
  d.getFullYear();
const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

//get
//document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
  const city = document.getElementById("city").value;
  if (city.length === 0) {
    alert("Please enter city's name");
  } else {
    let resultData = {};
    getApiKeys()
      .then(() => getGeonamesData(city))
      .then((data) => {
        // let userInput = document.getElementById("feelings").value;
        resultData["lat"] = data.geonames[0].lat;
        resultData["lng"] = data.geonames[0].lng;
        resultData["city"] = data.geonames[0].name;
        resultData["country"] = data.geonames[0].countryName;
        resultData["population"] = data.geonames[0].population;

        console.log(resultData);

        return resultData;
      })
      .then((resultData) => getWeatherbitData(resultData))
      .then((data) => {
        resultData["currentWeather"] = data.currentWeather;
        console.log(data);
        resultData["dailyWeather"] = data.dailyWeather;
        const pictureData = getPictureData(resultData);
        return pictureData;
      })
      .then((pictureData) => {
        console.log("pic", pictureData);
        resultData["img_url"] = pictureData.hits[0].webformatURL;
        console.log("data", resultData);

        postData("http://localhost:3000/add", {
          city: resultData.city,
          country: resultData.country,
          currentWeather: resultData.currentWeather,
          dailyWeather: resultData.dailyWeather,
          img_url: resultData.img_url,
          population: resultData.population,
        });
      })
      .then(updateUI);
  }
}

const getApiKeys = async () => {
  const res = await fetch("http://localhost:3000/get_parameters");

  try {
    const keys = await res.json();
    apiKeys = keys;
    return keys;
  } catch (error) {
    console.log("error", error);
  }
};

const getGeonamesData = async (city) => {
  const res = await fetch(
    `${baseURL}${city}&maxRows=1&username=${apiKeys.API_GEONAMES}`
  );
  console.log("got API");
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const getWeatherAndPicture = (inputData) => {
  let resultData = inputData;
};
const getWeatherbitData = async (inputData) => {
  let data = {};
  //get current weather
  const res = await fetch(
    `${baseWeatherbitURL}current?lat=${inputData.lat}&lon=${inputData.lng}&key=${apiKeys.API_WEATHERBIT}`
  );
  try {
    const currentWeather = await res.json();
    console.log(currentWeather.data[0]);
    data["currentWeather"] = currentWeather.data[0];
  } catch (error) {
    console.log("error", error);
  }
  // get weather forecast
  const res_forecast = await fetch(
    `${baseWeatherbitURL}forecast/daily?lat=${inputData.lat}&lon=${inputData.lng}&key=${apiKeys.API_WEATHERBIT}`
  );
  try {
    const dailyWeather = await res_forecast.json();
    console.log(dailyWeather.data);
    data["dailyWeather"] = dailyWeather.data;
  } catch (error) {
    console.log("error", error);
  }
  return data;
};

const getPictureData = async (inputData) => {
  const cityName =
    inputData.city.replace(" ", "+") +
    "+" +
    inputData.country.replace(" ", "+");

  const res = await fetch(
    `${basePixabayURL}${apiKeys.API_PIXABAY}&q=${cityName}&orientation=horizontal&category=places&image_type=photo`
  );
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};
const updateUI = async () => {
  const request = await fetch("http://localhost:3000/all");
  try {
    const serverData = await request.json();
    let tripStart = new Date(document.getElementById("date").value);
    let today = new Date();
    let daysLeft = (tripStart - today) / (1000 * 60 * 60 * 24) + 1;

    // document.getElementById("days_left").innerHTML =  "Now in <strong>" + serverData.city + "</strong>";;

    // document.getElementById("date").innerHTML = serverData.date;
    // if (serverData.weather.length) {
    //   document.getElementById("weather").innerHTML =
    //     serverData.weather[0].description;
    // }
    // document.getElementById("temp").innerHTML =
    //   "<h1>" + serverData.temperature + "° C" + "</h1>";
    // document.getElementById("content").innerHTML = serverData.userInput;
  } catch (error) {
    console.log("error", error);
  }
};

export { performAction };
