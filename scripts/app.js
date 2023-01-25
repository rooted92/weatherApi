let cityName = document.querySelector('#cityName');
let currentTemperature = document.querySelector('#currentTemperature');
let userSearch = document.querySelector('#userSearch');
let searchBtn = document.querySelector('#searchBtn');
let weatherDescription = document.querySelector('#weatherDescription');
let highLowTemps = document.querySelector('#highLowTemps')
let currentTime = document.querySelector('#currentTime');
let morningTemp = document.querySelector('#morningTemp');
let noonTemp = document.querySelector('#noonTemp');
let eveningTemp = document.querySelector('#eveningTemp');
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

let userInput = '';
let latData, lonData;

searchBtn.addEventListener('click', function () {
    userInput = userSearch.value;
    console.log(userInput);
    GetWeatherByCityStateZip(userInput);
});

async function GetWeatherByCityStateZip(input) {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial&appid=08cdf9fb4dfbb3595d9bfdd0c03e90af`);
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
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=08cdf9fb4dfbb3595d9bfdd0c03e90af`);
    const data = await promise.json();

    console.log(data);
    console.log(Math.floor(data.list[2].main.temp))
    // morningTemp.innerHTML = `${Math.floor(data.list[2].main.temp)}&#8457;`;
    // noonTemp.innerHTML = `${Math.floor(data.list[4].main.temp)}&#8457;`;
    // eveningTemp.innerHTML = `${Math.floor(data.list[6].main.temp)}&#8457;`;

    //figure out a way to get the temp of the day for each day...
    for (let i = 0; i < data.list.length; i++) {
        const dt_txt = data.list[i].dt_txt;
        const date = new Date(dt_txt);
        const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
        const day = date.getDate();
        const month = date.getMonth() + 1;

        // Use the values of dayOfWeek, day, month and year to build the final string 
        const finalString = `${dayOfWeek} ${month}/${day}`;
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

//diplay current time
const UpdateCurrentTime = () => {
    let date = new Date();//create date object
    let hours = date.getHours();//gets hours in local time zone
    let minutes = date.getMinutes();//gets minutes in local time zone
    let ampm = hours >= 12 ? 'PM' : 'AM';//checks if hours is greater than or equal to twelve if it is PM if not it is AM
    hours = hours % 12;//turns hours to 0
    hours = hours ? hours : 12; //ternary operator to check if housrs is 0 if it is then it will return 12 to keep the 12 hour format if it's not then it will just return the same hour
    minutes = minutes < 10 ? '0' + minutes : minutes;
    currentTime.textContent = `${hours}:${minutes}${ampm}`;
}

setInterval(UpdateCurrentTime, 1000);//updates time every second