#Travel App Project

## **Introduction**

This project is a web-application that shows information, weather and picture in your travel destination city.
The goal of this project is to create an asynchronous web app that uses Web API and user data to dynamically update the UI.

The application:

1. Displays a form where you enter the location you are traveling to and the date you are leaving.
   <img src="img/app.png" width="250"/>
2. After you click on the "Get information" button you will get the information how soon the trip is, the current weather forecast in the city and predicted forecast for the first three trip's days and a picture of the city.
   <img src="img/result.png" width="200"/>

## **Getting Started**

### Getting Setup

#### Installing Node and NPM

This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (the download includes NPM) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

#### Installing Express Environment

For setting up a local server install the Express package from the terminal in the directory, where server.js file is. Run:

```bash
npm install express
```

#### Installing project dependencies

For install `cors` and `body-parser` open your terminal in the directory, where server.js file is and run:

```bash
npm install cors
npm install body-parser
npm i
```

### API Credentials

The project uses 3 APIs, including [Geonames](http://www.geonames.org/export/web-services.html), [Weatherbit](https://www.weatherbit.io/account/create), and [Pixabay](https://pixabay.com/api/docs/).
Create API credentials on these services and put it in the .env file on the variables named API_GEONAMES, API_WEATHERBIT and API_PIXABAY.

### Run Local Server

For running local server in the main directory of project run command:

- **development mode**

```
npm run build-dev
npm run start
```

Open [http://localhost:8082](http://localhost:8082) to view it in the browser.

- **production mode**

```
npm run build-prod
npm run start
```

Open [http://localhost:3000](http://localhost:3000)

### Run unit tests

```bash
$ npm test
```
