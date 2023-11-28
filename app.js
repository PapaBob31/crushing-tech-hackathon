
let currentlyShownComponent = {trigger: null, component: null};

function toggleComponentVisibility(event, component) {
  event.stopPropagation();

  if (currentlyShownComponent.component) {
    currentlyShownComponent.component.classList.toggle("shown")
    currentlyShownComponent.trigger.setAttribute("aria-expanded", "false")
    if (currentlyShownComponent.component === component) {
      currentlyShownComponent.trigger = null;
      currentlyShownComponent.component = null;
      return;
    }
  }
  component.classList.toggle("shown")
  currentlyShownComponent.trigger = event.currentTarget;
  currentlyShownComponent.trigger.setAttribute("aria-expanded", "true")
  currentlyShownComponent.component = component;
}

const menu =  document.getElementById("menu")
const menuToggle = document.getElementById("menu-toggle")
const profileButton = document.getElementById("profile-button")
menuToggle.addEventListener("click", event => toggleComponentVisibility(event, menu))
profileButton.addEventListener("click", event => toggleComponentVisibility(event, menu))

const notificationIcon = document.getElementById("notification-icon")
const notifications = document.getElementById("alerts-div")
notificationIcon.addEventListener("click", event => toggleComponentVisibility(event, notifications))

function hidePopupComponent() { // hide any popped up element (e.g menu) when clicked outside of it
  if (currentlyShownComponent) {
    currentlyShownComponent.component.classList.toggle("shown") 
    currentlyShownComponent.trigger.setAttribute("aria-expanded", "false")
    currentlyShownComponent.component = null;
    currentlyShownComponent.trigger = null;
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
      // Moves focus to link above. If the link is the first one, focus should return to last link in the menu
      cfli = (cfli > 0 ? cfli - 1 : menuLinks.length - 1)
    }else if (event.key === "ArrowDown" ||  event.key === "ArrowRight")  {
      // Moves focus to link below. If the link is the last one, focus should return to first link in the menu
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

const stepsVisibilityToggles = setUpGuide.querySelectorAll(".step-header-btn");
stepsVisibilityToggles.forEach(button => button.addEventListener("click", (event) => toggleFocusedState(event.target)))
let currentlyFocusedStep = null;

// Toggles the state of each step in setup section
function toggleFocusedState(element) {
  let step = element.closest("li")
  let stepDescription = step.querySelector(".description")
  let stepImage = step.querySelector("img")

  if (step !== currentlyFocusedStep) {
    if (currentlyFocusedStep) {
      currentlyFocusedStep.classList.remove("focused-step")
      currentlyFocusedStep.querySelector(".description").style.height = null
      currentlyFocusedStep.querySelector("img").style.height = null
    }
    currentlyFocusedStep = step
    currentlyFocusedStep.classList.add("focused-step")
    stepDescription.style.height = stepDescription.scrollHeight + "px"
    stepImage.style.height = stepImage.scrollHeight + "px"
  }
}

let checkMarkBtns = Array.from(document.querySelectorAll(".checkmark-btn"))
checkMarkBtns.forEach(btn => btn.addEventListener("click", setButtonState))

function expandNextUnMarkedStep(next_index) {
  for (let i=next_index, n=0; n < 5; n++, i++) {
    i=(i+5)%5; // changes i to 0 incase we reach the last index and we haven't iterated through all checkMarks
    if (!checkMarkBtns[i].classList.contains("marked")) {
      toggleFocusedState(checkMarkBtns[i])
      break;
    }
  }
}

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
        expandNextUnMarkedStep(checkMarkBtns.indexOf(checkMarkBtn)+1)
      }else {
        checkMarkBtn.dataset.state = "unmarked"
        checkMarkBtn.className = "checkmark-btn unmarked"
        progress -= 20
      }
      progressBar.setAttribute("aria-valuenow", progress.toString())
      progressText.textContent = (progress/20).toString() + " / 5 Completed"
      progressBar.className = percentageMapping[progress] // Updates progress bar display
    }, 2000)
  }
}