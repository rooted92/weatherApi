// TODO for 1/27/2023
//Find another way save city without user input value***
//switch to night mode 1
//Fix the heart btn toggle 2
//Toggle between temp units 3
//style fonts (bolder, smaller, etc.)
//see if you can switch from OWM icons to the client icons (make object) 4
//... that might be it


import { prod, dev } from './environments.js';
import { UpdateCurrentTime, CreateForecastDivElment, SetTime, GetLocalTime } from './functions.js';
import { GetFavorites, SaveFavoritesToLocalStorage, RemoveCityFromLocalStorage } from './favoritesStorage.js';

//get local time
let currentInterval;
currentInterval = setInterval(UpdateCurrentTime, 1000);//updates time every second

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
let forecastDiv = document.getElementById('forecastDiv');//being used in functions.js
let fcDayOneBtn = document.querySelector('#fcDayOne');
let fcDayTwoBtn = document.querySelector('#fcDayTwo');
let fcDayThreeBtn = document.querySelector('#fcDayThree');
let fcDayFourBtn = document.querySelector('#fcDayFour');
let fcDayFiveBtn = document.querySelector('#fcDayFive');
let dayMode = document.querySelector('#dayMode');
let nightMode = document.querySelector('#nightMode');
let body = document.querySelector('body');
let nav = document.querySelector('nav');
let currentTempDiv = document.querySelector('.currentTempData');
let tempThoughOutDiv = document.querySelector('.tempThroughOutDay');
let fcColOne = document.querySelector('#fcColOne');
let fcColTwo = document.querySelector('#fcColTwo');
let fcColThree = document.querySelector('#fcColThree');
let fcColFour = document.querySelector('#fcColFour');
let fcColFive = document.querySelector('#fcColFive');
let openHeart = document.querySelector('#openHeart');

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

searchBtn.addEventListener('click', function () {
    addBtn.innerHTML = '';
    addBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    userInput = userSearch.value;
    GetWeatherByCityStateZip(userInput);
});

addBtn.addEventListener('click', function () {
    faveCitiesList.innerHTML = '';
    SaveFavoritesToLocalStorage(userSearch.value);
    CreateFavoriteCityElements();
});

openFavoritesBtn.addEventListener('click', function () {
    //get local storage
    let localStorageData = GetFavorites();
});
dayMode.addEventListener('click', function () {
    body.className = 'dayBG';
    nav.className = 'bg-light';
    currentTempDiv.className = 'currentTempData';
    tempThoughOutDiv.className = 'tempThroughOutDay';
    fcColOne.className = 'dayColumn';
    fcColTwo.className = 'dayColumn';
    fcColThree.className = 'dayColumn';
    fcColFour.className = 'dayColumn';
    fcColFive.className = 'dayColumn';
    openFavoritesBtn.className = 'addToFavesBtn d-flex flex-row justify-content-center';
    openHeart.className = 'openHeartBtn';
    faveCitiesList.className = 'offcanvasBG';
});
nightMode.addEventListener('click', function () {
    body.className = 'nightBG';
    nav.className = 'bg-dark';
    currentTempDiv.className = 'currentTempDataNight'
    tempThoughOutDiv.className = 'tempThroughOutNight';
    fcColOne.className = 'nightColumn';
    fcColTwo.className = 'nightColumn';
    fcColThree.className = 'nightColumn';
    fcColFour.className = 'nightColumn';
    fcColFive.className = 'nightColumn';
    openFavoritesBtn.className = 'addToFavesBtnNight d-flex flex-row justify-content-center';
    openHeart.className = 'openHeartBtnNight';
    faveCitiesList.className = 'offcanvasBGNight';
});

async function GetWeatherByCityStateZip(input) {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial` + apiKey);
    const data = await promise.json();

    console.log('data in weatherbysearch below');
    console.log('unix time: ' + data.dt);
    console.log(data);
    let unixTimeStamp = new Date(data.dt * 1000);
    let localDateString = unixTimeStamp.toUTCString();
    console.log('toUTCString value: ' + localDateString);
    let formattedUnix = unixTimeStamp.toLocaleDateString('default', { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' })
    console.log('here is formatted unix time stame! ' + formattedUnix);
    let unversalTime = new Date().getTime();
    let localDateTime = new Date(unversalTime + (data.timezone * 1000));
    console.log('Local time: ' + localDateTime);
    let formatLocalTime = localDateTime.toLocaleDateString('default', { weekday: 'long', month: 'numeric', day: 'numeric', year: 'numeric' });
    console.log(`Formatted local date in ${data.name}: ` + formatLocalTime);
    let hours = localDateTime.getHours();
    console.log('Local hours: ' + hours);
    let minutes = localDateTime.getMinutes();
    console.log('Local minutes: ' + minutes);
    let ampm = hours >= 12 ? 'PM' : 'AM';//checks if hours is greater than or equal to twelve if it is PM if not it is AM
    hours = hours % 12;//turns hours to 0
    hours = hours ? hours : 12; //ternary operator to check if housrs is 0 if it is then it will return 12 to keep the 12 hour format if it's not then it will just return the same hour
    minutes = minutes < 10 ? '0' + minutes : minutes;
    console.log(`Final format for time in ${data.name}: ${hours}:${minutes}${ampm}`)
    latData = data.coord.lat;
    lonData = data.coord.lon;
    cityName.textContent = `${data.name.toUpperCase()}`;
    currentTemperature.innerHTML = `${Math.floor(data.main.temp)}&#8457;`;
    weatherDescription.textContent = `${data.weather[0].description}`;
    highLowTemps.innerHTML = `H:${Math.floor(data.main.temp_max)}&#8457; L:${Math.floor(data.main.temp_min)}&#8457;`;
    let keys = Object.keys(weatherIconsOWM);//turns object into array
    let weatherCondition = data.weather[0].main;//weather condition to check if it's inside array
    if (keys.includes(weatherCondition)) {
        currentTempImg.src = `${weatherIconsOWM[weatherCondition]}`;
    }
    
    // GetLocalTime(data.timzone); <-- try and fix this function later
    todaysDate.textContent = formatLocalTime;
    clearInterval(currentInterval);
    currentInterval = setInterval(() => {
        currentTime.textContent = `${hours}:${minutes}${ampm}`;
    }, 1000);

    GetWeatherForecast(latData, lonData);
}

//this function will take in two parameters (lat, lon) and pass them into the api url
//I will take the lat and lon data from the direct geo api call in GetWeatherByCityStateZip();
//and put them in variables that I will pass as arguments into GetWeatherForcast();
//GetWeatherForecast(latData, lonData); will retrive 5 day forecast for city searched by user
async function GetWeatherForecast(lat, lon) {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial` + apiKey);
    const data = await promise.json();

    let isOpened = true;
    fcDayOneBtn.addEventListener('click', function () {
        CreateForecastDivElment(data.list[3].main.humidity, data.list[3].main.pressure, data.list[3].wind.gust, data.list[3].wind.speed, data.list[3].dt_txt, data.list[3].weather[0].description, isOpened);
        isOpened = !isOpened;
    });
    fcDayTwoBtn.addEventListener('click', function () {
        CreateForecastDivElment(data.list[11].main.humidity, data.list[11].main.pressure, data.list[11].wind.gust, data.list[11].wind.speed, data.list[11].dt_txt, data.list[11].weather[0].description, isOpened);
        isOpened = !isOpened;
    });
    fcDayThreeBtn.addEventListener('click', function () {
        CreateForecastDivElment(data.list[19].main.humidity, data.list[19].main.pressure, data.list[19].wind.gust, data.list[19].wind.speed, data.list[19].dt_txt, data.list[19].weather[0].description, isOpened);
        isOpened = !isOpened;
    });
    fcDayFourBtn.addEventListener('click', function () {
        CreateForecastDivElment(data.list[27].main.humidity, data.list[27].main.pressure, data.list[27].wind.gust, data.list[27].wind.speed, data.list[27].dt_txt, data.list[27].weather[0].description, isOpened);
        isOpened = !isOpened;
    });
    fcDayFiveBtn.addEventListener('click', function () {
        CreateForecastDivElment(data.list[35].main.humidity, data.list[35].main.pressure, data.list[35].wind.gust, data.list[35].wind.speed, data.list[35].dt_txt, data.list[35].weather[0].description, isOpened);
        isOpened = !isOpened;
    });

    //figure out a way to get the temp of the day for each day...
    for (let i = 0; i < data.list.length; i++) {
        const dt_txt = data.list[i].dt_txt;
        const date = new Date(dt_txt);
        const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });//<--- 'short' = 'TUE'
        const day = date.getDate();
        const month = date.getMonth() + 1;//months are indexed so add 1 cuz they start at 0
        // Use the values of dayOfWeek, day, month and year to build the final string 
        const finalString = `${dayOfWeek.toUpperCase()} ${month}/${day}`;// you can use the finalString to display date

        //check for weather conditions to display correct icon from array
        let keys = Object.keys(weatherIconsOWM);
        let weatherCondition = data.list[i].weather[0].main;

        if (i === 3) {
            dateOne.textContent = `${finalString}`;
            dateOneTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
            if (keys.includes(weatherCondition)) {
                dateOneImg.src = weatherIconsOWM[weatherCondition];
            }
        }
        else if (i === 11) {
            dateTwo.textContent = `${finalString}`;
            dateTwoTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
            if (keys.includes(weatherCondition)) {
                dateTwoImg.src = weatherIconsOWM[weatherCondition];
            }
        }
        else if (i === 19) {
            dateThree.textContent = `${finalString}`;
            dateThreeTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
            if (keys.includes(weatherCondition)) {
                dateThreeImg.src = weatherIconsOWM[weatherCondition];
            }
        }
        else if (i === 27) {
            dateFour.textContent = `${finalString}`;
            dateFourTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
            if (keys.includes(weatherCondition)) {
                dateFourImg.src = weatherIconsOWM[weatherCondition];
            }
        }
        else if (i === 35) {
            dateFive.textContent = `${finalString}`;
            dateFiveTemp.innerHTML = `${Math.floor(data.list[i].main.temp_max)}&#8457; | ${Math.floor(data.list[i].main.temp_min)}&#8457;`;
            if (keys.includes(weatherCondition)) {
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

    let convertTime = new Date(data.dt * 1000);
    let formattedTime = convertTime.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' });
    console.log('Time has been formatted! ' + formattedTime);
    console.log('data in current weather below');
    console.log(data);
    let localStorageData = GetFavorites();
    cityName.textContent = `${data.name.toUpperCase()}`;
    localStorageData.push(`${data.name}`);
    currentTemperature.innerHTML = `${Math.floor(data.main.temp)}&#8457;`;
    weatherDescription.textContent = `${data.weather[0].description}`;
    highLowTemps.innerHTML = `H:${Math.floor(data.main.temp_max)} L:${Math.floor(data.main.temp_min)}`;
    //**** Important! checkout using Date.UTC */
    let currentDate = new Date();
    const dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' });
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();
    todaysDate.textContent = `${dayOfWeek} ${month}/${day}/${year}`;

    let keys = Object.keys(weatherIconsOWM);
    let weatherCondition = data.weather[0].main;
    if (keys.includes(weatherCondition)) {
        currentTempImg.src = weatherIconsOWM[weatherCondition];
    }
}

const CreateFavoriteCityElements = () => {
    let favorites = GetFavorites();

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

//populate saved cities when page loads
CreateFavoriteCityElements();