// https://openweathermap.org/current
// http://127.0.0.1:5500/my-projects/myGarden/index.html?

class Plant {
  constructor(plantName, sowDay, harvestDay, plantId) {
    this.plantName = plantName;
    this.sowDay = sowDay;
    this.harvestDay = harvestDay;
  }
}

class Weather {
  constructor(weatherToday, weatherForecast) {
    this.weatherToday = weatherToday;
    this.weatherForecast = weatherForecast;
  }
}

const state = {
  currentPlant: {},
  gardenStorage: [],
};

// selecting elements
const addButton = document.querySelector(".form-submit");
const plants = document.querySelector(".plants");
let plantNameInput = document.querySelector("#plant-name");
let plantSowDateInput = document.querySelector("#plant-sow-date");
let plantHarvestDateInput = document.querySelector("#plant-harvest-date");
const weatherToday = document.querySelector(".weather-today");
const weatherForecast = document.querySelector(".weather-forecast");

// functions
// adding plant to storage
const addPlant = function (e) {
  e.preventDefault();
  const plant = document.createElement("div");
  plant.classList.add("plant");
  plant.id = `${plantNameInput.value}`;
  plant.innerHTML = `<p>${plantNameInput.value}</p>
  <p>Sow Date: ${plantSowDateInput.value}</p>
  <p>Harvest Date: ${plantHarvestDateInput.value}</p>
  <button class="watered-plant">watered today?</button>
  <i class="far fa-edit edit-plant"></i><i class="far fa-trash-alt remove-plant"></i>
  `;
  plants.appendChild(plant);

  state.currentPlant = new Plant(
    plantNameInput.value,
    plantSowDateInput.value,
    plantHarvestDateInput.value
  );

  state.gardenStorage.push(state.currentPlant);
  //console.log("state.gardenStorage: ", state.gardenStorage);
  console.log("state: ", state);
  // console.log("plantTest: ", plantTest);

  // adding plants to localStorage
  LocalStorage.insertPlants();

  // TODO: create a function for this funcionality
  // cleaning form fields
  plantNameInput.value = "";
  plantSowDateInput.value = "";
  plantHarvestDateInput.value = "";
};

const removePlant = function (element) {
  plants.removeChild(element);
};

// event listeners
// adding plant to UI and localStorage
addButton.addEventListener("click", addPlant);

// removing plant from UI, state and localStorage
window.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-plant")) {
    // removing from UI
    removePlant(e.target.parentElement);

    // removing from localStorage
    LocalStorage.removePlants(e.target.parentElement.id);

    // removing from state
    //state.gardenStorage.
    state.gardenStorage.forEach((plant, index) => {
      if (plant.plantName == e.target.parentElement.id) {
        state.gardenStorage.splice(index, 1);
      }
    });
    console.log("state.gardenStorage after removing:", state.gardenStorage);
  }
});

// localStorage CRUD
class LocalStorage {
  // create plants in localStorage
  static insertPlants() {
    state.gardenStorage.forEach(function (plant, plantName) {
      localStorage.setItem(plant.plantName, JSON.stringify(plant));
    });
  }

  // retrieve plants from localStorage
  static getPlants() {
    state.gardenStorage = [];
    for (let i = 0; i < localStorage.length; i++) {
      state.gardenStorage.push(
        JSON.parse(localStorage.getItem(localStorage.key(i)))
      );
    }
    console.log(state.gardenStorage);
  }

  // remove plants from localStorage
  static removePlants(id) {
    localStorage.removeItem(id);
  }

  // update plants from localStorage
  static changePlants(plant, id) {
    localStorage.setItem(id, JSON.stringify(plant));
  }
}

// api consuming WEATHER
const API_URL = "";
const apiKey = "78afda9384a67b825b39c29a9197ecac";

const loadWeatherForecast = async function () {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&appid=${apiKey}`
  );
  let dataResults = await response.json();

  const dataResultsMidday = dataResults.list.filter((result) => {
    result = result.dt_txt.includes("12:00:00");
    return result;
  });
  //console.log(dataResultsMidday);
  weatherForecast.innerHTML = "<span>next days</span> ";
  // removing today
  dataResultsMidday.shift();
  dataResultsMidday.forEach((result) => {
    let temp = `${Math.round(result.main.temp)}ºC`;
    let icon = `<img class="weather-icon" src="http://openweathermap.org/img/wn/${result.weather[0].icon}.png"></img>`;

    weatherForecast.insertAdjacentHTML("beforeend", icon);
  });
};
loadWeatherForecast();

const loadWeatherToday = async function () {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${apiKey}`
  );
  let dataResult = await response.json();
  //console.log(dataResult);
  let icon = `<img class="weather-icon" src="http://openweathermap.org/img/wn/${dataResult.weather[0].icon}@2x.png"></img>`;

  weatherToday.innerHTML = `${icon} ${Math.round(dataResult.main.temp)}ºC`;

  // adding icon
};
loadWeatherToday();
