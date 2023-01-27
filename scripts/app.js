// TODO for 1/27/2023
// Find a way to display the correct weather icons according to weather description
// For the weather icons save the icon code to a variable and then pass in the value of that variable into a url that will 'fetch' the relevant icon and display it accordingly
//Instead make an object and have key:value pairs for each icon according to weather description
//when you do an add to favorites function add a paramenter to save input from the getweatherforecast funcitons
//Find another way save city without user input value

import { prod, dev } from './environments.js';
import { UpdateCurrentTime } from './functions.js';
import { GetFavorites, SaveFavoritesToLocalStorage, RemoveCityFromLocalStorage } from './favoritesStorage.js';

//get local time
setInterval(UpdateCurrentTime, 1000);//updates time every second

//hide api key code
let apiKey = '&appid=';

if (prod.isLive) {
    apiKey += prod.apiKey;
}
else {
    apiKey += dev.apiKey;
}

let cityName = document.querySelector('#cityName');
let currentTemperature = document.querySelector('#currentTemperature');
let userSearch = document.querySelector('#userSearch');
let searchBtn = document.querySelector('#searchBtn');
let weatherDescription = document.querySelector('#weatherDescription');
let highLowTemps = document.querySelector('#highLowTemps')
let dateOne = document.querySelector('#dateOne');
let dateOneImg = document.querySelector('#dateOneImg');
let dateOneTemp = document.querySelector('#dateOneTemp');
let dateTwo = document.querySelector('#dateTwo');
let dateTwoImg = document.querySelector('#dateTwoImg');
let dateTwoTemp = document.querySelector('#dateTwoTemp');
let dateThree = document.querySelector('#dateThree');
let dateThreeImg = document.querySelector('#dateThreeImg');
let dateThreeTemp = document.querySelector('#dateThreeTemp');
let dateFour = document.querySelector('#dateFour');
let dateFourImg = document.querySelector('#dateFourImg');
let dateFourTemp = document.querySelector('#dateFourTemp');
let dateFive = document.querySelector('#dateFive');
let dateFiveImg = document.querySelector('#dateFiveImg');
let dateFiveTemp = document.querySelector('#dateFiveTemp');
let todaysDate = document.querySelector('#todaysDate');
let addBtn = document.querySelector('#addBtn');
let openFavoritesBtn = document.querySelector('#openFavoritesBtn');
let faveCitiesList = document.querySelector('#faveCitiesList');
let currentTime = document.querySelector('#currentTime');//being used in functions.js
let currentTempImg = document.querySelector('#currentTempImg');

let userInput = '';
let latData, lonData;
const weatherIconsOWM = {
    "Thunderstorm": "http://openweathermap.org/img/wn/11d@2x.png",
    "Drizzle": "http://openweathermap.org/img/wn/09d@2x.png",
    "Rain": "http://openweathermap.org/img/wn/10d@2x.png",
    "Snow": "http://openweathermap.org/img/wn/13d@2x.png",
    "Atmosphere": "http://openweathermap.org/img/wn/50d@2x.png",
    "Clear": "http://openweathermap.org/img/wn/01d@2x.png",
    "Clouds": "http://openweathermap.org/img/wn/03d@2x.png"
};

console.log('here is city name before search: ' + cityName.textContent);

searchBtn.addEventListener('click', function () {
    addBtn.innerHTML = '';
    addBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    userInput = userSearch.value;
    console.log('User Input(searchBtn): ' + userInput);
    GetWeatherByCityStateZip(userInput);
});

addBtn.addEventListener('click', function () {
    //<-- not the right way to do this...
    faveCitiesList.innerHTML = '';
    console.log('Here is added city(addBtn): ' + userSearch.value);
    SaveFavoritesToLocalStorage(userSearch.value);
    CreateFavoriteCityElements();
});

openFavoritesBtn.addEventListener('click', function () {
    //get local storage
    let localStorageData = GetFavorites();
    console.log('Here is local storage(openFavoritesBtn):' + localStorageData);
});

async function GetWeatherByCityStateZip(input) {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial` + apiKey);
    const data = await promise.json();
    console.log(data);
    latData = data.coord.lat;
    lonData = data.coord.lon;
    cityName.textContent = `${data.name.toUpperCase()}`;
    currentTemperature.innerHTML = `${Math.floor(data.main.temp)}&#8457;`;
    weatherDescription.textContent = `${data.weather[0].description}`;
    highLowTemps.innerHTML = `H:${Math.floor(data.main.temp_max)}&#8457; L:${Math.floor(data.main.temp_min)}&#8457;`;
    let keys = Object.keys(weatherIconsOWM);//turns object into array
    let weatherCondition = data.weather[0].main;//weather condition to check if it's inside array
    if(keys.includes(weatherCondition))
    {
        currentTempImg.src = `${weatherIconsOWM[weatherCondition]}`;
    }

    GetWeatherForecast(latData, lonData);
}

//this function will take in two parameters (lat, lon) and pass them into the api url
//I will take the lat and lon data from the direct geo api call in GetWeatherByCityStateZip();
//and put them in variables that I will pass as arguments into GetWeatherForcast();
//GetWeatherForecast(latData, lonData); will retrive 5 day forecast for city searched by user
async function GetWeatherForecast(lat, lon) {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial` + apiKey);
    const data = await promise.json();

    console.log('weather forecast data: below');
    console.log(data);
    console.log(data.list[3].weather.main);
    //figure out a way to get the temp of the day for each day...
    for (let i = 0; i < data.list.length; i++) {
        const dt_txt = data.list[i].dt_txt;
        const date = new Date(dt_txt);
        const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });//<--- 'short' = 'TUE'
        const day = date.getDate();
        const month = date.getMonth() + 1;//months are indexed so add 1 cuz they start at 0
        // Use the values of dayOfWeek, day, month and year to build the final string 
        const finalString = `${dayOfWeek.toUpperCase()} ${month}/${day}`;// you can use the finalString to display date
        console.log(finalString);

        
        //check for weather conditions to display correct icon from array
        let keys = Object.keys(weatherIconsOWM);
        let weatherCondition = data.list[i].weather[0].main;
        
        if (i === 3) {
            dateOne.textContent = `${finalString}`;
            dateOneTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
            if(keys.includes(weatherCondition))
            {
                dateOneImg.src = weatherIconsOWM[weatherCondition];
            }
        }
        else if (i === 11) {
            dateTwo.textContent = `${finalString}`;
            dateTwoTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
            if(keys.includes(weatherCondition))
            {
                dateTwoImg.src = weatherIconsOWM[weatherCondition];
            }
        }
        else if (i === 19) {
            dateThree.textContent = `${finalString}`;
            dateThreeTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
            if(keys.includes(weatherCondition))
            {
                dateThreeImg.src = weatherIconsOWM[weatherCondition];
            }
        }
        else if (i === 27) {
            dateFour.textContent = `${finalString}`;
            dateFourTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
            if(keys.includes(weatherCondition))
            {
                dateFourImg.src = weatherIconsOWM[weatherCondition];
            }
        }
        else if (i === 35) {
            dateFive.textContent = `${finalString}`;
            dateFiveTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
            if(keys.includes(weatherCondition))
            {
                dateFiveImg.src = weatherIconsOWM[weatherCondition];
            }
        }
    }
}

//get user position
let userPosLat, userPosLon;
//basic skeleton for geolocation to work (getcurrentposition)
function success(position) {
    userPosLat = position.coords.latitude;
    userPosLon = position.coords.longitude;

    DisplayCurrentWeather(userPosLat, userPosLon);
    GetWeatherForecast(userPosLat, userPosLon);
}
function error(err) {
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
    console.log('convertime variable: ' + convertTime);
    console.log('converted time in displayweather: ' + convertTime.toUTCString());
    let localStorageData = GetFavorites();
    console.log('GetFavorites() inside DisplayWeather: ' + localStorageData);
    cityName.textContent = `${data.name.toUpperCase()}`;
    localStorageData.push(`${data.name}`);
    console.log('GetFavorites() inside DisplayWeather: ' + localStorageData);
    currentTemperature.innerHTML = `${Math.floor(data.main.temp)}&#8457;`;
    weatherDescription.textContent = `${data.weather[0].description}`;
    highLowTemps.innerHTML = `H:${Math.floor(data.main.temp_max)} L:${Math.floor(data.main.temp_min)}`;
    //**** Important! checkout using Date.UTC */
    let currentDate = new Date();
    console.log(currentDate);
    let jsonDate = currentDate.toJSON();
    console.log('this is jsonDate: ' + jsonDate);
    // console.log(weekday);
    const dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' });
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();
    todaysDate.textContent = `${dayOfWeek} ${month}/${day}/${year}`;

    let keys = Object.keys(weatherIconsOWM);
    let weatherCondition = data.weather[0].main;
    if(keys.includes(weatherCondition))
    {
        currentTempImg.src = weatherIconsOWM[weatherCondition];
    }
}

const CreateFavoriteCityElements = () => {
    let favorites = GetFavorites();
    console.log('Favorites List: ' + favorites);

    favorites.map(city => {
        let p = document.createElement('p');
        p.textContent = city;

        let cityNameDiv = document.createElement('div');
        cityNameDiv.className = 'col-6 d-flex justify-content-start';
        cityNameDiv.appendChild(p);

        let i = document.createElement('i');
        i.className = 'fa-solid fa-xmark';

        let deleteBtn = document.createElement('button');
        deleteBtn.id = 'deleteBtn';
        deleteBtn.className = 'deleteBtnX';
        deleteBtn.type = 'button';
        deleteBtn.appendChild(i);
        deleteBtn.addEventListener('click', function () {
            RemoveCityFromLocalStorage(city);
            outerDiv.innerHTML = '';
            addBtn.className = 'heartBtn';//double check why you put this here!!!
        });

        let delBtnDiv = document.createElement('div');
        delBtnDiv.className = 'col-6 d-flex justify-content-end';
        delBtnDiv.appendChild(deleteBtn);

        let btnRow = document.createElement('div');
        btnRow.className = 'row';
        btnRow.appendChild(cityNameDiv);
        btnRow.appendChild(delBtnDiv);

        let cityItemDiv = document.createElement('div');
        cityItemDiv.className = 'cityItemClass p-3 mb-2';
        cityItemDiv.appendChild(btnRow);

        let outerDiv = document.createElement('div');
        outerDiv.appendChild(cityItemDiv);

        faveCitiesList.appendChild(outerDiv);

        addBtn.innerHTML = '';
        addBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    });
}

//populate saved cities
CreateFavoriteCityElements();