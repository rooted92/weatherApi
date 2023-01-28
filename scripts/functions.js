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
    //add isCurrentTime = false here... maybe this is where you needed to put it
}

const SetTime = (interval, func) => {
    clearInterval(interval);
    interval = setInterval(func, 1000);
}

const GetLocalTime = (timezone) => {
    let UTC = new Date().getTime();
    let localTime = new Date(UTC + (timezone * 1000));
    let hours = localTime.getHours();
    let minutes = localTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    currentTime.textContent = `${hours}:${minutes}${ampm}`;
}

// Create function that will create a div when one of the forecast divs is clicked
const CreateForecastDivElment = (humidity, pressure, gust, speed, dateTimeText, weather, bool) => {
    const date = new Date(dateTimeText);
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' }).toUpperCase();

    let humidityP = document.createElement('p');
    humidityP.id = 'humidity';
    humidityP.textContent = `Humidity: ${humidity}`;
    let pressureP = document.createElement('p');
    pressureP.id = 'pressure';
    pressureP.textContent = `Pressure: ${pressure}`;
    let windP = document.createElement('p');
    windP.id = 'wind';
    windP.textContent = `Wind - gust:  ${gust}/speed:  ${speed}`;

    let firstInnerCol = document.createElement('div');
    firstInnerCol.className = 'col-12';
    firstInnerCol.appendChild(humidityP);
    firstInnerCol.appendChild(pressureP);
    firstInnerCol.appendChild(windP);

    let moreDataDiv = document.createElement('div');
    moreDataDiv.className = 'moreDataDiv d-flex justify-content-evenly';
    moreDataDiv.appendChild(firstInnerCol);

    let detailsText = document.createElement('p');
    detailsText.id = 'detailsText';
    detailsText.textContent = 'WEATHER DETAILS';

    let secondOuterCol = document.createElement('div');
    secondOuterCol.className = 'col-6';
    secondOuterCol.appendChild(detailsText);
    secondOuterCol.appendChild(moreDataDiv);

    let longDayP = document.createElement('p');
    longDayP.id = 'longDayText';
    longDayP.className = 'longDayForecastText';
    longDayP.textContent = `${dayOfWeek}`;

    let hr = document.createElement('hr');

    let weatherDscrptnP = document.createElement('p');
    weatherDscrptnP.id = 'weatherDscrptn';
    weatherDscrptnP.textContent = weather

    let firstOuterCol = document.createElement('div');
    firstOuterCol.className = 'col-6';
    firstOuterCol.appendChild(longDayP);
    firstOuterCol.appendChild(hr);
    firstOuterCol.appendChild(weatherDscrptnP);

    let row = document.createElement('div');
    row.className = 'row';
    row.appendChild(firstOuterCol);
    row.appendChild(secondOuterCol);
    
    if(bool)
    {
        forecastDiv.appendChild(row);
        forecastDiv.className = 'forecastData fadeIn';
    }
    else
    {
        forecastDiv.innerHTML = '';
        forecastDiv.className = '';
    }
}

export { UpdateCurrentTime, CreateForecastDivElment, SetTime, GetLocalTime }