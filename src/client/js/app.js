import { checkInputData } from "./checkData";

/* Global Variables */
// base API url addresses
const baseURL = "http://api.geonames.org/searchJSON?q=";
const baseWeatherbitURL = "https://api.weatherbit.io/v2.0/";
const basePixabayURL = "https://pixabay.com/api/?key=";

let apiKeys = {};

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

const performAction = (e) => {
  // check if input data is correct
  const city = document.getElementById("city").value;
  const tripStartText = document.getElementById("date").value;
  const tripStart = new Date(tripStartText);
  const today = new Date();
  //set zerro time for correct computation
  tripStart.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const message = Client.checkInputData(city, tripStartText, tripStart, today);
  if (message) {
    alert(message);
  } else {
    // let's start if data is correct
    let resultData = {};

    getApiKeys()
      .then(() => getGeonamesData(city))
      .then((data) => {
        if (!data.geonames.length) {
          alert(
            "The data for the city wasn't found. Please check city's name."
          );
        }
        resultData["lat"] = data.geonames[0].lat;
        resultData["lng"] = data.geonames[0].lng;
        resultData["city"] = data.geonames[0].name;
        resultData["country"] = data.geonames[0].countryName;
        resultData["population"] = data.geonames[0].population;
        return resultData;
      })
      .then((resultData) => getWeatherbitData(resultData))
      .then((data) => {
        resultData["currentWeather"] = data.currentWeather;
        resultData["dailyWeather"] = data.dailyWeather;
        const pictureData = getPictureData(resultData);
        return pictureData;
      })
      .then((pictureData) => {
        // if picture wasn't found than use base picture
        if (pictureData.hits.length) {
          resultData["img_url"] = pictureData.hits[0].webformatURL;
        } else {
          resultData["img_url"] = "../media/map_of_the_world.jpg";
        }

        postData("http://localhost:3000/add", {
          city: resultData.city,
          country: resultData.country,
          currentWeather: resultData.currentWeather,
          dailyWeather: resultData.dailyWeather,
          img_url: resultData.img_url,
          population: resultData.population,
        });
      })
      .then(updateUI(tripStart, today));
  }
};

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
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const getWeatherbitData = async (inputData) => {
  let data = {};
  //get current weather
  const res = await fetch(
    `${baseWeatherbitURL}current?lat=${inputData.lat}&lon=${inputData.lng}&key=${apiKeys.API_WEATHERBIT}`
  );
  try {
    const currentWeather = await res.json();
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
    data["dailyWeather"] = dailyWeather.data;
  } catch (error) {
    console.log("error", error);
  }
  return data;
};

const getPictureData = async (inputData) => {
  // if there is spaces in city's or/and name we have to chage
  // them to "-" for correct searching
  const cityName =
    inputData.city.replaceAll(" ", "+") +
    "+" +
    inputData.country.replaceAll(" ", "+");

  const res = await fetch(
    `${basePixabayURL}${apiKeys.API_PIXABAY}&q=${cityName}&orientation=horizontal&category=places&image_type=photo`
  );
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};
const updateUI = async (tripStart, today) => {
  //add timer. we need to get all data before show it.
  await wait(2000);
  const request = await fetch("http://localhost:3000/all");
  try {
    const serverData = await request.json();

    /* days left to trip's start*/
    let daysLeft = Math.trunc((tripStart - today) / (1000 * 60 * 60 * 24));
    let text_days =
      daysLeft === 0
        ? " today"
        : " in " + daysLeft + " day" + (daysLeft === 1 ? "" : "s");
    document.getElementById("days_left").innerHTML =
      "Your trip starts" + text_days;

    /* country */
    document.getElementById("country").innerHTML =
      serverData.city + ", " + serverData.country;

    /* image of place of destination */
    const dest_img = document.querySelector("#destination_img");
    dest_img.style.content = "url(" + serverData.img_url + ")";

    /* today's weather */
    document.querySelector("#weather_now").innerHTML =
      "Now in " + serverData.city;
    // set weather's icon via style
    document.querySelector(
      "#weather_ico"
    ).style.content = `url("../media/icons/${serverData.currentWeather.weather.icon}.png")`;
    document.querySelector("#current_weather_disc").innerHTML =
      serverData.currentWeather.weather.description;
    document.querySelector("#current_temp").innerHTML =
      Math.trunc(serverData.currentWeather.temp) + " °C";

    /* Wearther forecast */
    const weatherForecast = document.querySelector("#weather_forecast");
    //clear weather forecast section
    weatherForecast.innerHTML = "";
    //check if there is information. There is forecast only for next 16 days
    if (daysLeft <= 16) {
      //give weather information for 3 days from trip's start or
      //for as many days as possible, considering that there is
      //weatheforecast only for next 16 days
      for (let i = daysLeft; i < Math.min(daysLeft + 3, 16); i = i + 1) {
        const thisDayWeather = serverData.dailyWeather[i];
        //get the date of day in local format
        const daydate = new Date(thisDayWeather.datetime)
          .toLocaleDateString()
          .replaceAll("/", ".");
        // block of html text for weather forecast
        const htmlTextToAdd = `<div class="weather_descr">
              <div id="weather${i}">${daydate}</div>
              <img id="weather_ico${i}" class = "weather_day_icon"/>
              <div id="day_weather_disc${i}">${
          thisDayWeather.weather.description
        }</div>
              <div class="temp" id="day_temp${i}">${
          Math.trunc(thisDayWeather.temp) + " °C"
        }</div>
            </div>`;
        weatherForecast.insertAdjacentHTML("beforeend", htmlTextToAdd);
        // set icon's url via style
        document.querySelector(
          `#weather_ico${i}`
        ).style.content = `url("../media/icons/${thisDayWeather.weather.icon}.png")`;
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

// wait ms milliseconds
const wait = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};

export { performAction };
