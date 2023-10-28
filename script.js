// API Key
const API_KEY = "cdc235742acb15a78eb826cceefe6c3a";
 
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");


const searchForm = document.querySelector("[data-searchForm]");
const userInfoContainer = document.querySelector(".userInfoContainer");
const grantAccessContainer = document.querySelector(".grantLocationContainer");
const loadingScreen = document.querySelector('.loadingContainer');

const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');

//variables
let currentTab = userTab;

currentTab.classList.add("current-tab");
getfromSessionStorage();


// Tab Switching
function switchTab(clickedTab){
    notFound.classList.remove("active");
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        //check in which tab am i
        if(!searchForm.classList.contains("active")){
            //kya search form wala container is invisible then make it visible 
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            //mai phela search wala tab mai tha aab weather wala tab mai switch kar gya
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            //aab mai your weather tab mai a gya hu tho weather bhi display krna hoga 
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click',()=>{
    switchTab(userTab)
});

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});


//check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("userCoordinates");
    if(!localCoordinates){
        //agar local cordinates nahi mila
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


//fetching weather info
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //API CAll
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await res.json();

        if (!data.sys) {
            throw data;
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }catch(err){
        loadingScreen.classList.remove("active");
        notFound.classList.add('active');
        errorImage.style.display = 'none';
        errorText.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';
        errorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}


//rendering weather ifo in UI
function renderWeatherInfo(weatherInfo){

    //fetch elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector('[data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const clouds = document.querySelector('[data-clouds]');

    //fetch values from weatherInfo object and put it in UI
    cityName.textContent = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
}


// find out current location for user tab
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert("no geoloaction support");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userContainer); 
}


//now use the search input to provide the data
const searchInput = document.querySelector('[data-searchInput]');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (searchInput.value === "") {
        return;
    }
    // console.log(searchInput.value);
    fetchSearchWeatherInfo(searchInput.value);
    searchInput.value = "";
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        notFound.classList.remove('active');
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";
    }
}





























