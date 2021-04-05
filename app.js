class Plant {
  constructor(plantName, sowDay) {
    this.plantName = plantName;
    this.sowDay = sowDay;
  }
}

// selecting elements
const addButton = document.querySelector(".form-submit");
const plants = document.querySelector(".plants");
let plantNameInput = document.querySelector("#plant-name");
let plantDateInput = document.querySelector("#plant-date");

// functions
const addPlant = function (e) {
  e.preventDefault();
  const plant = document.createElement("div");
  console.log("plantNameInput: ", plantNameInput.value);
  plant.innerHTML = `<p>${plantNameInput.value}</p>
  <p>${plantDateInput.value}</p>
  `;
  plants.appendChild(plant);

  let plantTest = new Plant(plantNameInput.value, plantDateInput.value);
  console.log("plantTest: ", plantTest);

  plantNameInput.value = "";
  plantDateInput.value = "";
};

// event listeners
addButton.addEventListener("click", addPlant);
