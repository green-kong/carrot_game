'use strict';

const bgSound = new Audio("sound/bg.mp3");
const bugSound = new Audio("sound/bug_pull.mp3");
const carrotSound = new Audio("sound/carrot_pull.mp3");
const winSound = new Audio("sound/game_win.mp3");
const alertSound = new Audio("sound/alert.wav");

const volume = document.querySelector(".volume");
let volumeon = 0;

export function playCarrot() {
  playSound(carrotSound);
}

export function playBug() {
  playSound(bugSound);
}

export function playWin() {
  playSound(winSound);
}

export function playAlert() {
  playSound(alertSound);
}

export function playBg() {
  if (volume.childNodes[1].classList.contains("hide")) {
    return;
  } 
  playSound(bgSound);
}

export function stopBg() {
  stopSound(bgSound);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

volume.addEventListener("click", ()=>{
  volume.childNodes[1].classList.toggle("hide");
  volume.childNodes[3].classList.toggle("hide");
  if (volumeon == 1) {
      bgSound.play();
      volumeon = 0;
  } else if (volumeon == 0) {
      bgSound.pause();
      volumeon = 1;
  }
});