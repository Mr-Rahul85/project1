async function fetchWeather() {
  const main = document.getElementById("destination-page");

  if (!main) {
    console.error("destination-page not found");
    return;
  }

  const city = main.dataset.city;
  console.log("Fetching weather for:", city);

  try {
    const response = await fetch(`/api/weather?city=${city}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Weather data:", data);

    document.getElementById("condition").textContent =
      data.weather[0].description;

    document.getElementById("temperature").textContent =
      `${data.main.temp}°C`;

    document.getElementById("feels-like").textContent =
      `${data.main.feels_like}°C`;

    document.getElementById("wind").textContent =
      `${data.wind.speed} m/s`;

    document.getElementById("pressure").textContent =
      `${data.main.pressure} hPa`;

    document.getElementById("weather-icon").src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  } catch (err) {
    console.error("Error fetching weather data:", err);
  }
}

window.addEventListener("DOMContentLoaded", fetchWeather);
