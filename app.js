// https://openweathermap.org/current
// http://127.0.0.1:5500/my-projects/myGarden/index.html?

class Plant {
  constructor(plantName, sowDay, harvestDay, plantId) {
    this.plantName = plantName;
    this.sowDay = sowDay;
    this.harvestDay = harvestDay;
    this.plantId = plantId;
  }
}

class Weather {
  constructor(weatherToday, weatherForecast) {
    this.weatherToday = weatherToday;
    this.weatherForecast = weatherForecast;
  }
}

let gardenStorage = [];

// selecting elements
const addButton = document.querySelector(".form-submit");
const plants = document.querySelector(".plants");
let plantNameInput = document.querySelector("#plant-name");
let plantSowDateInput = document.querySelector("#plant-sow-date");
let plantHarvestDateInput = document.querySelector("#plant-harvest-date");
const weatherToday = document.querySelector(".weather-today");

// markup plant

// functions
const addPlant = function (e) {
  e.preventDefault();
  const plant = document.createElement("div");
  plant.classList.add("plant");
  plant.id = `${plantNameInput.value}`;
  //console.log("{plantSowDateInput: ", {plantSowDateInput.value);
  plant.innerHTML = `<p>${plantNameInput.value}</p>
  <p>Sow Date: ${plantSowDateInput.value}</p>
  <p>Harvest Date: ${plantHarvestDateInput.value}</p>
  <button class="watered-plant">watered today?</button>
  <i class="far fa-edit edit-plant"></i><i class="far fa-trash-alt remove-plant"></i>
  `;
  plants.appendChild(plant);

  gardenStorage.push(
    new Plant(
      plantNameInput.value,
      plantSowDateInput.value,
      plantHarvestDateInput.value,
      //TODO: improve ID setter
      gardenStorage.length + 1
    )
  );
  console.log("gardenStorage: ", gardenStorage);
  // console.log("plantTest: ", plantTest);

  plantNameInput.value = "";
  plantSowDateInput.value = "";
  plantHarvestDateInput.value = "";
};

const removePlant = function (element) {
  plants.removeChild(element);
};

// event listeners
// adding plant
addButton.addEventListener("click", addPlant);
// removing plant
window.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-plant")) {
    removePlant(e.target.parentElement);
  }
});

// api consuming
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
  dataResultsMidday.forEach((result) => {
    /* console.log(
      `on ${result.dt_txt}, the temperature will be ${result.main.temp}ºC and ${result.weather[0].description}`
    ); */
  });
};
loadWeatherForecast();

const loadWeatherToday = async function () {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${apiKey}`
  );
  let dataResult = await response.json();
  //console.log(dataResult);
  weatherToday.innerText = `${Math.round(dataResult.main.temp)}ºC ${
    dataResult.weather[0].main
  }`;
};
loadWeatherToday();

// localStorage CRUD
class LocalStorage {
  // create plants in localStorage
  static insertPlants() {
    gardenStorage.forEach(function (plant, plantId) {
      localStorage.setItem(plant.plantId, JSON.stringify(plant));
    });
  }

  // retrieve plants from localStorage
  static getPlants() {
    gardenStorage = [];
    for (let i = 0; i < localStorage.length; i++) {
      gardenStorage.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
    console.log(gardenStorage);
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
