/* Global Variables */
// openweather url address
const baseURL = "http://api.geonames.org/searchJSON?q=";
//http://api.geonames.org/searchJSON?q=${des}&maxRows=1&username=${GEONAMES_USERNAME}

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
    getApiKeys()
      .then((apiKeys) => getWeatherData(city, apiKeys))
      .then(function (data) {
        // temperature in celsius
        let temperature = data.main.temp.toFixed(0);
        let cityName = data.name;
        let weatherDescription = data.weather;

        let userInput = document.getElementById("feelings").value;
        postData("http://localhost:3000/add", {
          date: newDate,
          city: cityName,
          temperature: temperature,
          userInput: userInput,
          weather: weatherDescription,
        });
      })
      .then(updateUI);
  }
}

const getApiKeys = async () => {
  const res = await fetch("http://localhost:3000/get_parameters");

  try {
    const keys = await res.json();
    return keys;
  } catch (error) {
    console.log("error", error);
  }
};
const getWeatherData = async (city, apiKeys) => {
  const res = await fetch(
    `${baseURL}${city}&maxRows=1&username=${apiKeys.API_GEONAMES}`
  );
  console.log("got API");
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", eror);
  }
};

const updateUI = async () => {
  const request = await fetch("http://localhost:3000/all");
  try {
    const serverData = await request.json();
    document.getElementById("city").innerHTML =
      "Now in <strong>" + serverData.city + "</strong>";
    document.getElementById("date").innerHTML = serverData.date;
    if (serverData.weather.length) {
      document.getElementById("weather").innerHTML =
        serverData.weather[0].description;
    }
    document.getElementById("temp").innerHTML =
      "<h1>" + serverData.temperature + "° C" + "</h1>";
    document.getElementById("content").innerHTML = serverData.userInput;
  } catch (error) {
    console.log("error", error);
  }
};

export { performAction };
