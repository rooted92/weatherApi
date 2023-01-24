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

let userInput = '';
searchBtn.addEventListener('click', function(){
    userInput = userSearch.value;
    console.log(userInput);
    GetWeatherByCityStateZip(userInput);
    GetWeatherForecast();
});

async function GetWeatherByCityStateZip(input) {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&units=imperial&appid=08cdf9fb4dfbb3595d9bfdd0c03e90af`);
    const data = await promise.json();
    
    console.log(data);
    cityName.textContent = `${data.name.toUpperCase()}`;
    currentTemperature.innerHTML = `${Math.floor(data.main.temp)}<sup>&#8457;</sup>`;
    weatherDescription.textContent = `${data.weather[0].description}`;
    highLowTemps.innerHTML = `H:${Math.floor(data.main.temp_max)}<sup>&#8457;</sup> L:${Math.floor(data.main.temp_min)}<sup>&#8457;</sup>`;
}

//test function
async function GetWeatherForecast() {
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=-10.99&units=imperial&appid=08cdf9fb4dfbb3595d9bfdd0c03e90af`);
    const data = await promise.json();

    console.log(data);
    console.log(Math.floor(data.list[2].main.temp))
    morningTemp.innerHTML = `${Math.floor(data.list[2].main.temp)}<sup>&#8457;</sup>`;
    noonTemp.innerHTML = `${Math.floor(data.list[4].main.temp)}<sup>&#8457;</sup>`;
    eveningTemp.innerHTML = `${Math.floor(data.list[6].main.temp)}<sup>&#8457;</sup>`;
}
GetWeatherForecast();
//diplay current time
const UpdateCurrentTime = () => {
    let date = new Date();//create date object
    let hours = date.getHours();//gets hours in local time zone
    let minutes = date.getMinutes();//gets minutes in local time zone
    let ampm = hours >= 12 ? 'PM' : 'AM';//checks if hours is greater than or equal to twelve if it is PM if not it is AM
    hours = hours % 12;//turns hours to 0
    hours = hours ? hours : 12; //ternary operator to check if housrs is 0 if it is then it will return 12 to keep the 12 hour format if it's not then it will just return the same hour
    minutes = minutes < 10 ? '0'+minutes : minutes;
    currentTime.textContent = `${hours}:${minutes} ${ampm}`;  
}

setInterval(UpdateCurrentTime, 1000);//updates time every second