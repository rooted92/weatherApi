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

export {UpdateCurrentTime}