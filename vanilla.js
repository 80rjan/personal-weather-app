const input = document.querySelector('input');

async function getWeatherData() {
    // const result = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/skopje?unitGroup=metric&key=9FGVEAKH295DXRWMVNCWV2QNV&contentType=json');
    const result = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + input.value + '?unitGroup=metric&key=9FGVEAKH295DXRWMVNCWV2QNV&contentType=json');
    const weatherData = await result.json();
    console.log(weatherData);
    return weatherData;
}

const weatherTodayHeader = document.querySelector('#weatherToday > h1');
const weatherTodayIcon = document.querySelector('#weatherToday .icon img');
const weatherTodayTemp = document.querySelector('#weatherToday .temp');
const weatherTodayConditions = document.querySelector('#weatherToday .conditions');
const weatherTodayFeelslike = document.querySelector('#weatherToday .feelsLike');
const weatherTodayDescription = document.querySelector('#normalData > h4');
const weatherTodayMaxTemp = document.querySelector('#normalData .maxTemp > h2');
const weatherTodayMinTemp = document.querySelector('#normalData .minTemp > h2');
const weatherTodayUv = document.querySelector('#normalData .uvIndex > h2');
const weatherTodayWindSpeed = document.querySelector('#normalData .windSpeed > h2');

const iconMap = {
    "clear-day": "01",
    "clear-night": "33",
    "rain": "12",
    "snow": "22",
    "sleet": "29",
    "wind": "24",
    "fog": "11",
    "cloudy": "07",
    "partly-cloudy-day": "03",
    "partly-cloudy-night": "38",
    // Add more mappings as needed
};

async function setWeatherDataToday() {
    const weather = await getWeatherData();

    const weatherToday = document.getElementById('weatherToday');
    if (weather.currentConditions.icon.includes('Rain') || weather.currentConditions.icon.includes('rainy'))weatherToday.style.backgroundImage = "url(img/rainy.jpg)";
    else if (weather.currentConditions.icon.includes('Night') || weather.currentConditions.icon.includes('night'))weatherToday.style.backgroundImage = "url(img/night.jpg)";
    else if (weather.currentConditions.icon.includes('Cloudy') || weather.currentConditions.icon.includes('cloudy'))weatherToday.style.backgroundImage = "url(img/cloudy.jpg)";
    else if (weather.currentConditions.icon.includes('Clear') || weather.currentConditions.icon.includes('clear'))weatherToday.style.backgroundImage = "url(img/sunshine.jpg)";

    const iconNumber = iconMap[weather.currentConditions.icon] || "na";
    const iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`;
    weatherTodayHeader.textContent = weather.resolvedAddress;
    weatherTodayIcon.src = iconUrl;
    weatherTodayIcon.alt = weather.currentConditions.icon;
    weatherTodayTemp.textContent = `${Math.round(weather.currentConditions.temp)}°C`;
    weatherTodayIcon.style.height = weatherTodayTemp.offsetHeight + 'px';
    weatherTodayConditions.textContent = weather.currentConditions.conditions;
    weatherTodayFeelslike.textContent = `Feels like: ${Math.round(weather.currentConditions.feelslike)}°C`;
    weatherTodayDescription.textContent = weather.days[0].description;
    weatherTodayMaxTemp.textContent = `${Math.round(weather.days[0].tempmax)}°C`;
    weatherTodayMinTemp.textContent = `${Math.round(weather.days[0].tempmin)}°C`;
    weatherTodayUv.textContent = weather.days[0].uvindex;
    weatherTodayWindSpeed.textContent = `${Math.round(weather.days[0].windspeed)} km/h`;
}

function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getUTCDay()];
}

async function setWeatherDataDays() {
    const weather = await getWeatherData();

    const weatherDays = document.getElementById('weatherDays');
    weatherDays.innerHTML = ''; // Clear previous days

    for (let i = 1; i <= 6; i++) {
        const dayWrapper = document.createElement('div');
        dayWrapper.classList.add('dayWrapper');

        const dayDate = document.createElement('h2');
        dayDate.textContent = getDayOfWeek(weather.days[i].datetime);

        const iconNumber = iconMap[weather.days[i].icon] || "na";
        const iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`;
        const dayIcon = document.createElement('img');
        dayIcon.src = iconUrl;
        dayIcon.alt = weather.days[i].icon;

        const dayTempWrapper = document.createElement('div');
        dayTempWrapper.classList.add('dayTempWrapper');
        const dayMaxTemp = document.createElement('h3');
        dayMaxTemp.textContent = `${Math.round(weather.days[i].tempmax)}°C`;
        const dayMinTemp = document.createElement('h3');
        dayMinTemp.textContent = `${Math.round(weather.days[i].tempmin)}°C`;

        dayWrapper.appendChild(dayDate);
        dayWrapper.appendChild(dayIcon);
        dayWrapper.appendChild(dayTempWrapper);
        dayTempWrapper.appendChild(dayMaxTemp);
        dayTempWrapper.appendChild(dayMinTemp);

        weatherDays.appendChild(dayWrapper);
    }
}
input.addEventListener('keydown', event => {
    if (event.key==='Enter') {
        setWeatherDataToday();
        setWeatherDataDays();
    }
})

