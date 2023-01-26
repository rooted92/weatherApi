// TODO for 1/26/2023
// Create function that will add cities to list
// Function to populate list
// Create a delete function to remove cities from list
// a button will be called to add a button will be called to remove
// Find a way to display the correct weather icons according to weather description
// For the weather icons save the icon code to a variable and then pass in the value of that variable into a url that will 'fetch' the relevant icon and display it accordingly
import {prod, dev} from './environments.js';
import {UpdateCurrentTime} from './functions.js';

//get local time
setInterval(UpdateCurrentTime, 1000);//updates time every second

//hide api key code
let apiKey = '&appid=';

if(prod.isLive)
{
    apiKey += prod.apiKey;
}
else
{
    apiKey += dev.apiKey;
}

let cityName = document.querySelector('#cityName');
let currentTemperature = document.querySelector('#currentTemperature');
let userSearch = document.querySelector('#userSearch');
let searchBtn = document.querySelector('#searchBtn');
let weatherDescription = document.querySelector('#weatherDescription');
let highLowTemps = document.querySelector('#highLowTemps')
let dateOne = document.querySelector('#dateOne');
let dateOneTemp = document.querySelector('#dateOneTemp');
let dateTwo = document.querySelector('#dateTwo');
let dateTwoTemp = document.querySelector('#dateTwoTemp');
let dateThree = document.querySelector('#dateThree');
let dateThreeTemp = document.querySelector('#dateThreeTemp');
let dateFour = document.querySelector('#dateFour');
let dateFourTemp = document.querySelector('#dateFourTemp');
let dateFive = document.querySelector('#dateFive');
let dateFiveTemp = document.querySelector('#dateFiveTemp');
let todaysDate = document.querySelector('#todaysDate');

let userInput = '';
let latData, lonData;

searchBtn.addEventListener('click', function () {
    userInput = userSearch.value;
    console.log(userInput);
    GetWeatherByCityStateZip(userInput);
});

async function GetWeatherByCityStateZip(input) {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial` + apiKey);
    const data = await promise.json();

    latData = data.coord.lat;
    console.log(latData);
    lonData = data.coord.lon;
    console.log(lonData);

    console.log(data);
    cityName.textContent = `${data.name.toUpperCase()}`;
    currentTemperature.innerHTML = `${Math.floor(data.main.temp)}&#8457;`;
    weatherDescription.textContent = `${data.weather[0].description}`;
    highLowTemps.innerHTML = `H:${Math.floor(data.main.temp_max)}&#8457; L:${Math.floor(data.main.temp_min)}&#8457;`;

    GetWeatherForecast(latData, lonData);
}

//this function will take in two parameters (lat, lon) and pass them into the api url
//I will take the lat and lon data from the direct geo api call in GetWeatherByCityStateZip();
//and put them in variables that I will pass as arguments into GetWeatherForcast();
//GetWeatherForecast(latData, lonData); will retrive 5 day forecast for city searched by user
async function GetWeatherForecast(lat, lon) {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial` + apiKey);
    const data = await promise.json();

    console.log(data);
    console.log(Math.floor(data.list[2].main.temp))

    /* I am KEEPING weedays object to because I was proud to find out how to extract key values using Object.keys()!!!..... I later found out I can use 'short' in toLocaleString() */
    // const weekdays = {
    //     'Monday' : 'MON',
    //     'Tuesday' : 'TUE',
    //     'Wednsday' : 'WED',
    //     'Thursday' : 'THU',
    //     'Friday' : 'FRI',
    //     'Saturday' : 'SAT',
    //     'Sunday' : 'SUN'
    // }

    // let keys = Object.keys(weekdays);
    // let weekday = '';

    //figure out a way to get the temp of the day for each day...
    for (let i = 0; i < data.list.length; i++) {
        const dt_txt = data.list[i].dt_txt;
        const date = new Date(dt_txt);
        const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });//<--- 'short' = 'TUE'
        const day = date.getDate();
        const month = date.getMonth() + 1;
        // if(keys.includes(dayOfWeek))
        // {
        //     weekday = weekdays[dayOfWeek];
        // }
        // Use the values of dayOfWeek, day, month and year to build the final string 
        const finalString = `${dayOfWeek.toUpperCase()} ${month}/${day}`;
        console.log(finalString);
        // you can use the finalString to display the final string in your HTML or JavaScript
        if (i === 3) {
            dateOne.textContent = `${finalString}`;
            dateOneTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
        }
        else if (i === 11) {
            dateTwo.textContent = `${finalString}`;
            dateTwoTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
        }
        else if (i === 19) {
            dateThree.textContent = `${finalString}`;
            dateThreeTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
        }
        else if (i === 27) {
            dateFour.textContent = `${finalString}`;
            dateFourTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
        }
        else if (i === 35) {
            dateFive.textContent = `${finalString}`;
            dateFiveTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
        }
    }
}


//get user position
let userPosLat, userPosLon;
//basic skeleton for geolocation to work (getcurrentposition)
function success(position){
    console.log(position);
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    userPosLat = position.coords.latitude;
    userPosLon = position.coords.longitude;
    console.log('this is user lon: ' + userPosLon);

    DisplayCurrentWeather(userPosLat, userPosLon);
    GetWeatherForecast(userPosLat, userPosLon);
}
function error(err){
    console.warn(err.message);
}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}

//navigator
navigator.geolocation.getCurrentPosition(success, error, options);

async function DisplayCurrentWeather(userLat, userLon) {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&units=imperial` + apiKey);
    const data = await promise.json();

    console.log('Data from DisplayCurrentWeather: ' + data);
    console.log(data);
    console.log(data.dt);
    let convertTime = new Date(Date.UTC(data.dt));
    console.log(convertTime.toUTCString());
    cityName.textContent = `${data.name.toUpperCase()}`;
    currentTemperature.innerHTML = `${Math.floor(data.main.temp)}&#8457;`;
    weatherDescription.textContent = `${data.weather[0].description}`;
    highLowTemps.innerHTML = `H:${Math.floor(data.main.temp_max)} L:${Math.floor(data.main.temp_min)}`;
    //**** Important! checkout using Date.UTC */
    let currentDate = new Date();
    console.log(currentDate);
    let jsonDate = currentDate.toJSON();
    // console.log(weekday);
    console.log(jsonDate);
    let month = currentDate.getMonth() + 1;
    console.log(month);
    let day = currentDate.getDate();
    console.log(day);
    let year = currentDate.getFullYear()
    console.log(currentDate.getFullYear());
    todaysDate.textContent = `${month}/${day}/${year}`;
}