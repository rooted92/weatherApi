//declare global variables

//add to favorites function
function SaveFavoritesToLocalStorage(nameOfCity) {
    //get current values that are saved into local storage
    //create an array of values to store into local storage
    // let favorites = []; empty array was only returing one person
    let favorites = GetFavorites();

    //add new name to our favorites array
    if (!favorites.includes(nameOfCity))//includes checks to see if city already exists in array if not ture then push city
    {
        favorites.push(nameOfCity);

        //save our updated arrray to local storage
        //localStorage creates empty array
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    }
}

//create function get local storage
function GetFavorites() {
    //get all of the values that are in stored in favorites in local storage
    let localStorageData = localStorage.getItem('favoriteCities');// getItem we need to 'get' values
    if (localStorageData === null) {
        return [];
    }

    return JSON.parse(localStorageData); //we need to return our data parsed as jSON
}

//function to delete favorties from list
function RemoveCityFromLocalStorage(nameOfCity) {
    let favorites = GetFavorites();
    //find the index of the name in local storage
    let cityIndex = favorites.indexOf(nameOfCity);//reread docs on indexOf()!

    //remove the name from the array using the splice method
    favorites.splice(cityIndex, 1);

    //save updated array to local storage
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
}

export { SaveFavoritesToLocalStorage, GetFavorites, RemoveCityFromLocalStorage };