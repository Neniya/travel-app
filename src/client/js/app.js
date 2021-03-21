/* Global Variables */
// openweather url address
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "";
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
document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
  const zip = document.getElementById("zip").value;
  if (zip.length === 0) {
    alert("Please enter zip code");
  } else {
    getWeatherData(zip)
      .then(function (data) {
        // temperature in celsius
        let temperature = data.main.temp.toFixed(0);
        let cityName = data.name;
        let weatherDescription = data.weather;

        let userInput = document.getElementById("feelings").value;
        postData("/add", {
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
const getWeatherData = async (zip) => {
  const res = await fetch(
    baseURL + zip + ",DE&appid=" + apiKey + "&units=metric"
  );
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", eror);
  }
};

const updateUI = async () => {
  const request = await fetch("/all");
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
