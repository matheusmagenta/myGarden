// https://openweathermap.org/current
// http://127.0.0.1:5500/my-projects/myGarden/index.html?

class Plant {
  constructor(plantName, sowDate, harvestDate, plantId) {
    this.plantName = plantName;
    this.sowDate = sowDate;
    this.harvestDate = harvestDate;
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
const myPlantsButton = document.querySelector(".nav-myplants");

// functions

// render plant

const renderPlant = function (plant) {
  const plantDiv = document.createElement("div");
  plantDiv.classList.add("plant");
  plantDiv.id = `${plant.plantName}`;
  plantDiv.innerHTML = `<p class="plant-name-input">${plant.plantName}</p>
  <p class="plant-sow-input">Sow Date: ${plant.sowDate}</p>
  <p class="plant-harvest-input">Harvest Date: ${plant.harvestDate}</p>
  <div class="buttons-plant>
  <button class="watered-plant">watered today?</button>
  <i class="far fa-edit edit-plant"></i><i class="far fa-trash-alt remove-plant"></i>
  </div>
  `;
  plants.appendChild(plantDiv);
};

// adding plant to storage
const addPlant = function (e) {
  e.preventDefault();
  const plantDiv = document.createElement("div");
  plantDiv.classList.add("plant");
  plantDiv.id = `${plantNameInput.value}`;
  plantDiv.innerHTML = `<p class="plant-name-input">${plantNameInput.value}</p>
  <p class="plant-sow-input">Sow Date: ${plantSowDateInput.value}</p>
  <p class="plant-harvest-input">Harvest Date: ${plantHarvestDateInput.value}</p>
  <div class="buttons-plant>
  <button class="watered-plant">watered today?</button>
  <i class="far fa-edit edit-plant"></i><i class="far fa-trash-alt remove-plant"></i>
  </div>
  `;
  plants.appendChild(plantDiv);

  state.currentPlant = new Plant(
    plantNameInput.value,
    plantSowDateInput.value,
    plantHarvestDateInput.value
  );

  state.gardenStorage.push(state.currentPlant);
  console.log("state: ", state);

  // adding plants to localStorage
  LocalStorage.insertPlants();

  // clearing form fields
  clearForm();

  //updating button text
  addButton.innerHTML = "<i class='fas fa-plus'></i> add plant";
};

// removing plant
const removePlantFromUI = function (element) {
  plants.removeChild(element);
};

// editing plant
const editPlant = function (currentPlant) {
  plantNameInput.value = currentPlant.plantName;
  plantSowDateInput.value = currentPlant.sowDate;
  plantHarvestDateInput.value = currentPlant.harvestDate;
};

const clearForm = function () {
  plantNameInput.value = "";
  plantSowDateInput.value = "";
  plantHarvestDateInput.value = "";
};

// event listeners
// adding plant to UI and localStorage
addButton.addEventListener("click", addPlant);

// removing plant from UI, state and localStorage
window.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-plant")) {
    // removing from UI
    removePlantFromUI(e.target.parentElement.parentElement);

    // removing from localStorage
    LocalStorage.removePlantFromStorage(
      e.target.parentElement.parentElement.id
    );

    // removing from state
    //state.gardenStorage.
    state.gardenStorage.forEach((plant, index) => {
      if (plant.plantName == e.target.parentElement.parentElement.id) {
        state.gardenStorage.splice(index, 1);
      }
    });
    console.log("state.gardenStorage after removing:", state.gardenStorage);
  }
});

//get plant
function getPlant(id) {
  return state.gardenStorage.filter((plant) => plant.plantName === id);
  // console.log("state.currentPlant", state.currentPlant);
}

// editing plant
window.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-plant")) {
    console.log(e.target.parentElement.parentElement.id);
    // get plant targeted and put it at state.currentPlant
    state.currentPlant = getPlant(e.target.parentElement.parentElement.id);
    // fill form with currentPlant info
    editPlant(state.currentPlant[0]);
    // TODO: REFACTOR REMOVING TO AVOID DUPLICATED CODE
    // remove plant from render, localStorage and state
    removePlantFromUI(e.target.parentElement.parentElement);
    LocalStorage.removePlantFromStorage(
      e.target.parentElement.parentElement.id
    );
    state.gardenStorage.forEach((plant, index) => {
      if (plant.plantName == e.target.parentElement.parentElement.id) {
        state.gardenStorage.splice(index, 1);
      }
    });
    // change button name
    addButton.innerHTML = "<i class='fas fa-plus'></i> update plant";
  }
});

// show my plants
myPlantsButton.addEventListener("click", function (e) {
  e.preventDefault();
  // get plants from localStorage
  LocalStorage.getPlants();
  // hide addplant form

  // render plants
  state.gardenStorage.map((plant) => {
    renderPlant(plant);
  });
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
  static removePlantFromStorage(id) {
    localStorage.removeItem(id);
  }

  // update plants from localStorage
  static editPlants(plant, id) {
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
