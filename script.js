"use strict";
const filtersDiv = document.querySelector(".filter-btns");
const rotateAndFlipDiv = document.querySelector(".rotate-flip");
const scaleEditor = document.getElementById("range-edit");
const filterName = document.querySelector(".filter-name");
const filterValue = document.querySelector(".filter-value");
const editedImg = document.querySelector(".image img");
const uploadBtnInput = document.querySelector(".file-input");
const addImageBtn = document.querySelector(".upload");
const editingDiv = document.querySelector(".editing-div");
const saveImageBtn = document.querySelector(".Download");
const resetFilters = document.querySelector(".reset-filters");
const filterBtns = filtersDiv.querySelectorAll(".btn.filter");
let rotationValue = 0;
let mirrorValueH = 0;
let mirrorValueV = 0;
const stateFilters = {
  saturate: 1,
  invert: 0,
  grayscale: 0,
  brightness: 1,
};

// Main Functions

function uploadImage() {
  const image = uploadBtnInput.files[0];
  if (!image) return;
  editedImg.src = URL.createObjectURL(image);
  [saveImageBtn, editingDiv, resetFilters].forEach((btn) =>
    btn.classList.remove("disable")
  );
}

function resetFiltersFunction() {
  // Reset state Variables
  stateFilters.saturate = 1;
  stateFilters.invert = 0;
  stateFilters.grayscale = 0;
  stateFilters.brightness = 1;

  // Reset all image styles
  editedImg.style.filter = "";

  // Reset all image rotations and mirroring
  editedImg.style.transform = "";

  // Rerender range value for current filter
  const currentFilter = filterName.textContent.toLocaleLowerCase();
  const currentValue = stateFilters[currentFilter] * 100;
  filterValue.textContent = `${currentValue}%`;
  scaleEditor.value = currentValue;
}

function rotate(direction = "r") {
  rotationValue += direction === "r" ? 90 : -90;
  editedImg.style.transform = `rotate(${rotationValue}deg)`;
}

function mirror(direction = "h") {
  if (direction === "h") {
    mirrorValueH += 180;
    editedImg.style.transform = `rotateY(${mirrorValueH}deg)`;
  }
  if (direction === "v") {
    mirrorValueV += 180;
    editedImg.style.transform = `rotateX(${mirrorValueV}deg)`;
  }
}

function applyFilter() {
  // console.log(`${filterName}(${filterPercent})`);
  editedImg.style.filter = `saturate(${stateFilters.saturate}) brightness(${stateFilters.brightness}) invert(${stateFilters.invert}) grayscale(${stateFilters.grayscale})`;
}

function handleFlipAndRotate(e) {
  // Selecting target Button
  const btn = e.target.closest(".fa-solid");
  if (!btn) return;

  // Get the button function by it's class name
  const [rotateOrMirror, direction] = btn.dataset.func.split("_");
  // console.log(rotateOrMirror, direction);

  // Get the function by the dateset and access it from the object
  if (rotateOrMirror === "rotate") rotate(direction);
  else mirror(direction);
}

function handleFilterBtns(e) {
  // Select Btn
  const btn = e.target.closest(".btn.filter");
  if (!btn) return;

  // Make it active
  btn.classList.add("active-filter");
  filterBtns.forEach((b) => {
    if (b !== btn) b.classList.remove("active-filter");
  });

  // Display name of the editor
  filterName.textContent = btn.textContent;

  // Update the range input
  const stateValue =
    stateFilters[`${btn.textContent.trim().toLocaleLowerCase()}`] * 100;
  scaleEditor.value = stateValue;

  // Display the state value of the filter
  filterValue.textContent = `${stateValue}%`;
}

function handleScaleChange() {
  // Update Value text
  filterValue.textContent = `${scaleEditor.value}%`;

  // Update state variable
  const nameFilter = filterName.textContent.toLocaleLowerCase();
  const valueFilter = scaleEditor.value / 100;
  stateFilters[nameFilter] = valueFilter;

  // Apply filter
  applyFilter();
}

function handleSaveImg() {
function convertDegreesToScale(degrees) {
    return degrees === 180 ? -1 : 1;
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// Handle high-DPI screens (retina displays)
const pixelRatio = window.devicePixelRatio || 1;
canvas.width = editedImg.naturalWidth * pixelRatio;
canvas.height = editedImg.naturalHeight * pixelRatio;
ctx.scale(pixelRatio, pixelRatio);

// Apply filters
ctx.filter = `brightness(${stateFilters.brightness * 100}%) saturate(${stateFilters.saturate * 100}%) invert(${stateFilters.invert * 100}%) grayscale(${stateFilters.grayscale})`;

// Translate to the center of the canvas
ctx.translate(canvas.width / (2 * pixelRatio), canvas.height / (2 * pixelRatio));

// Apply rotation if needed
if (rotationValue !== 0) {
    ctx.rotate((rotationValue * Math.PI) / 180);
}

// Apply scaling for mirroring (mirrorValueH, mirrorValueV should be 1 or -1)
ctx.scale(
    convertDegreesToScale(mirrorValueH),
    convertDegreesToScale(mirrorValueV)
);

// Draw the image with the transformations
ctx.drawImage(
    editedImg,
    -canvas.width / (2 * pixelRatio),
    -canvas.height / (2 * pixelRatio),
    canvas.width / pixelRatio,
    canvas.height / pixelRatio
);

// Delay download to ensure everything is rendered
setTimeout(() => {
    const link = document.createElement("a");
    link.download = "newImage.jpg";
    link.href = canvas.toDataURL("image/jpg");
    link.click();
}, 900); // Adjust the delay if necessary
}


// Event Listeners
rotateAndFlipDiv.addEventListener("click", handleFlipAndRotate);
addImageBtn.addEventListener("click", () => uploadBtnInput.click());
uploadBtnInput.addEventListener("change", uploadImage);
filtersDiv.addEventListener("click", handleFilterBtns);
scaleEditor.addEventListener("input", handleScaleChange);
resetFilters.addEventListener("click", resetFiltersFunction);
saveImageBtn.addEventListener("click", handleSaveImg);
