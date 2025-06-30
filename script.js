// code to text 
const codeToText = {
  0:  'Clear sky',
  1:  'Mainly clear',
  2:  'Partly cloudy',
  3:  'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  56: 'Freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Heavy rain showers',
  82: 'Violent rain showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Heavy thunderstorm with hail'
};

async function getWeather() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  const encodedCity = encodeURIComponent(city);

  // to Get latitude & longitude for the city 
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=en&format=json`;
  try {
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || !geoData.results.length) {
      document.getElementById('weather-info').innerHTML = 'City not found.';
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    //this is for current weather and  humidity
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${latitude}&longitude=${longitude}` +
      `&current_weather=true` +
      `&hourly=relativehumidity_2m` +
      `&timezone=auto`;

    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
const { temperature, weathercode, time: cwTime } = weatherData.current_weather;

   
    let humidity = 'N/A';
    if (weatherData.hourly) {
      const idx = weatherData.hourly.time.indexOf(cwTime);
      if (idx !== -1) {
        humidity = weatherData.hourly.relativehumidity_2m[idx] + ' %';
      }
    }

  
    const weatherHTML = `
      <p><strong>Location:</strong> ${name}, ${country}</p>
      <p><strong>Temperature:</strong> ${temperature} °C</p>
      <p><strong>Condition:</strong> ${codeToText[weathercode] || 'Unknown'}</p>
      <p><strong>Humidity:</strong> ${humidity}</p>
      <p style="font-size:14px;color:#666;">(Data: Open‑Meteo, updated ${cwTime.replace('T', ' ')})</p>
    `;

    document.getElementById('weather-info').innerHTML = weatherHTML;
  } catch (err) {
    console.error(err);
    document.getElementById('weather-info').innerHTML =
      'Error fetching weather. Try again later.';
  }
}
