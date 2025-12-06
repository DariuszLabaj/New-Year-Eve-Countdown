// Inspired by Twitch Stream - Dr. Gluon's New Year's Eve Extravaganza

let diagonal;
let state = LOADING;

let tzImages = {};
let fireworkSounds = [];
let timezoneBg;
let strings;
let mySetpoint;
let font;
let loadProgress = 0;
let totalPromises = 0;
let fulfilledPromises = 0;

let stars = [];
let fireworks = [];
let vehicles = [];
let gravity;

let lastSecond = -1;

let fileInput;

function setup() {
  createCanvas(windowWidth, windowHeight);
  fileInput = createFileInput(handleFile);
  fileInput.hide();
  diagonal = sqrt(width*width+height*height);
  mySetpoint = getNextNewYearsEve();
  gravity = createVector(0, 0.2);
  loadSavedActivities();
  startLoading();
}

function draw(){
  colorMode(RGB);
  if (state === LOADING){
    background(40);
    drawLoadingBar();
    return;
  }
  const countdowns = getCountdowns(mySetpoint);
  const nearest = getNearestCountdown(countdowns);
  switch (state){
    case LONG_COUNTDOWN:
      if (nearest.countdown < 11){
        state = SHORT_COUNTDOWN;
      } else{
        drawLongCountdown(nearest);
        drawActivityUI(min(width/2-80, 600), min(height/2-80, 380), 40, 40);
      }
      break;
    case SHORT_COUNTDOWN:
      if (nearest.countdown > 11){
        state = FIREWORKS_START;
      } else{
        drawShortCountdown(nearest);
      }
      break;
    case FIREWORKS_START:
      startFireworksScene();
      state = FIREWORKS_VIEW;
      break;
    case FIREWORKS_VIEW:
      if (nearest.countdown < 3600 - 30){
        stars = [];
        fireworks = [];
        background(0);
        state = LONG_COUNTDOWN;
        stopAllFireworkSounds();
      } else {
        drawFireworksScene();
      }
      break;
  }
}

function doubleClicked() {
  if(!buttonClicked(activityUI.loadBtn) &&
     !buttonClicked(activityUI.rerollBtn) &&
     !buttonClicked(activityUI.setNextBtn)){
    fullscreen(!fullscreen());
  }
  return false;
}

function touchStarted() {
  fullscreen(!fullscreen());
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (stars.length > 0){
    diagonal = sqrt(width*width+height*height)
    stars = Array.from({length: diagonal / 5}, () => new Star());
  }
}
function mousePressed() {
  if (buttonClicked(activityUI.loadBtn)) loadActivitiesFromJSON();
  if (buttonClicked(activityUI.rerollBtn)) pickNextActivity();
  if (buttonClicked(activityUI.setNextBtn)) applyNextActivity();
}
function buttonClicked(btn) {
  return mouseX >= btn.x && mouseX <= btn.x + btn.w &&
         mouseY >= btn.y && mouseY <= btn.y + btn.h;
}
// debug k1eys
function keyPressed(event) {
  if (state === LOADING) return;
  switch (key) {
    case "1":
      console.log("Current state:", state);
      console.log("Setpoint:", mySetpoint);
      console.log("Countdowns:", getCountdowns(mySetpoint));
      break;

    case "2":
      // Jump to next full hour
      mySetpoint = getNextFullHourLocal();
      console.log("Setpoint changed to next full hour:", mySetpoint);
      break;

    case "3":
      // Force SHORT_COUNTDOWN (10 sec left)
      let now = new Date();
      now.setSeconds(now.getSeconds() + 12);
      mySetpoint = now;
      //state = SHORT_COUNTDOWN;
      console.log("Forced SHORT_COUNTDOWN, setpoint:", mySetpoint);
      break;

    case "4":
      // Force LONG_COUNTDOWN (12h left)
      let n = new Date();
      n.setHours(n.getHours() + 36);
      mySetpoint = n;
      state = LONG_COUNTDOWN;
      console.log("Forced LONG_COUNTDOWN, setpoint:", mySetpoint);
      break;

    case "5":
      // Force FIREWORKS_VIEW (just finished)
      mySetpoint = new Date();
      state = FIREWORKS_START;
      console.log("Forced FIREWORKS_VIEW");
      break;

    case "6":
      // Toggle fullscreen quickly
      fullscreen(!fullscreen());
      console.log("Toggled fullscreen:", fullscreen());
      break;

    case "7":
      // Print nearest timezone
      let nearest = getNearestCountdown(getCountdowns(mySetpoint));
      console.log("Nearest countdown:", nearest);
      break;

    case "8":
      // Reload to New Year's Eve
      mySetpoint = getNextNewYearsEve();
      console.log("Reset to New Year's Eve:", mySetpoint);
      break;
  }
}



