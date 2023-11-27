
let currentlyShownComponent = null;

function toggleComponentVisibility(event, component) {
  event.stopPropagation();

  if (currentlyShownComponent) {
    currentlyShownComponent.classList.toggle("shown")
    if (currentlyShownComponent === component) {
      currentlyShownComponent = null;
      return;
    }
  }
  component.classList.toggle("shown")
  currentlyShownComponent = component
}

const menu =  document.getElementById("profile-menu-content")
const menuToggle = document.getElementById("profile-button")
menuToggle.addEventListener("click", event => toggleComponentVisibility(event, menu))

const notificationIcon = document.getElementById("notification-icon")
const notifications = document.getElementById("alerts-div")
notificationIcon.addEventListener("click", event => toggleComponentVisibility(event, notifications))

function hidePopupComponent() { // hide any popped up element (e.g menu) when clicked outside of it
  if (currentlyShownComponent) {
    currentlyShownComponent.classList.toggle("shown")
    currentlyShownComponent = null;
  }
}

document.addEventListener("click", hidePopupComponent)
document.addEventListener("keyup", (event)=>{if (event.key === "Escape") hidePopupComponent()})

let cfli = -1 // Currently Focused Link Index
const menuLinks = Array.from(document.querySelector("nav").querySelectorAll("a,button"))

// update variable cfli on any focus not caused by arrow keys so that user can continue anytime with arrow keys
menuLinks.forEach(link => link.addEventListener("focus", ()=>{cfli = menuLinks.indexOf(event.target)}))

function handleKeyNavigation(event) {
  if (cfli < 0) {
    cfli = 0
  }else {
    if (event.key === "ArrowUp" ||  event.key === "ArrowLeft") {
      cfli = (cfli > 0 ? cfli - 1 : menuLinks.length - 1)
    }else if (event.key === "ArrowDown" ||  event.key === "ArrowRight")  {
      cfli = (cfli < menuLinks.length - 1 ? cfli + 1 : 0 )
    }else return;
  }
  menuLinks[cfli].focus()
}

menu.addEventListener("keyup", handleKeyNavigation)

const plansSection = document.getElementById("plans-section")
plansSectionCloseBtn = document.getElementById("close-icon")
plansSectionCloseBtn.addEventListener("click", ()=>{plansSection.className = "hidden"})

const setUpGuide = document.getElementById("setup-guide")
let setUpToggleBtn  = document.getElementById("setup-visibility-toggle")
setUpToggleBtn.addEventListener("click", showOrHideSetUp)

function showOrHideSetUp() {
  setUpGuide.classList.toggle("hidden") 
  setUpToggleBtn.classList.toggle("up")
}
  
let currentlyFocusedStep = document.querySelector(".focused-step")
const markToggleBtns = document.querySelectorAll(".checkmark-btn")
markToggleBtns.forEach(element => element.addEventListener("click", toggleMarkState))

// Toggles the state of each step in setup section
function toggleMarkState(event) { 
  currentlyFocusedStep.classList.remove("focused-step")
  currentlyFocusedStep = event.target.closest("li")
  currentlyFocusedStep.classList.add("focused-step")
}

let checkMarkBtns = document.querySelectorAll(".checkmark-btn")
checkMarkBtns.forEach(btn => btn.addEventListener("click", setButtonState))
const progressBar = document.getElementById("progress-bar")
let progressText = document.getElementById("progress-text")
let progress = 0;
const percentageMapping = {0: "", 20: "twenty", 40: "forty", 60: "sixty", 80: "eighty", 100: "hundred"}

function setButtonState(event) {
  let checkMarkBtn = event.currentTarget;
  
  if (checkMarkBtn.className !== "checkmark-btn loading") {
    checkMarkBtn.className = "checkmark-btn loading" // Shows a spinning bar
    setTimeout(()=>{// Delays for 800 ms before updating the final state of the button
      if (checkMarkBtn.dataset.state === "unmarked") {
        checkMarkBtn.dataset.state = "marked"
        checkMarkBtn.className = "checkmark-btn marked"
        progress += 20
      }else {
        checkMarkBtn.dataset.state = "unmarked"
        checkMarkBtn.className = "checkmark-btn unmarked"
        progress -= 20
      }
      progressBar.setAttribute("aria-valuenow", progress.toString())
      progressText.textContent = (progress/20).toString() + " / 5 Completed"
      progressBar.className = percentageMapping[progress] // Updates progress bar display
    }, 800)
  }
}