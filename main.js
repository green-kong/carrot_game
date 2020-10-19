'use strict';

const GAME_DURATION_SEC = 10;
const CARROT_SIZE = 80;
const BUG_SIZE = 50;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;

const field = document.querySelector(".game_field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game_util i");
const gameTimer = document.querySelector(".game_time");
const gameScore = document.querySelector(".carrot_num");
const popUp = document.querySelector(".game_message");
const popUpText = document.querySelector(".game_message p");
const replayBtn = document.querySelector(".fa-redo");
const volume = document.querySelector(".volume");

const bgSound = new Audio("sound/bg.mp3");
const bugSound = new Audio("sound/bug_pull.mp3");
const carrotSound = new Audio("sound/carrot_pull.mp3");
const winSound = new Audio("sound/game_win.mp3");
const alertSound = new Audio("sound/alert.wav");

let volumeon = 0;
let started = false;
let timer = undefined;
let score = 0;

gameBtn.addEventListener('click',()=>{
    if (started) {
        stopGame();
    } else {
        startGame();
    }
});

function startGame() {
    if (!volume.childNodes[1].classList.contains("hide")) {
        playSound(bgSound);
    }
    bgSound.currentTime = 0;
    started = true;
    initGame();
    showStopButton();
    startGameTimer();
}

function stopGame() {
    started = false;
    stopSound(bgSound);
    playSound(alertSound);
    stopGameTimer();
    hideGameButton();
    showPopUpWithText("Replay👻❓");
}

function finishGame(win) {
    started = false;
    hideGameButton();
    if (win) {
        playSound(winSound);
    } else {
        playSound(bugSound);
    }
    stopGameTimer();
    stopSound(bgSound);
    showPopUpWithText(win? "You Win!🥳🎉" : "You Lose!💣💥");
}

function showPopUpWithText(text) {
    popUpText.innerText = text;
    popUp.classList.remove("hide");
}

function hidePopUp() {
    popUp.classList.add("hide");
}

function playSound(sound) {
    sound.play();
}

function stopSound(sound) {
    sound.pause();
}

function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(()=>{
        if(remainingTimeSec <= 1) {
            gameTimer.textContent = "시간초과";
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000);
}

function stopGameTimer() {
    clearInterval(timer);
}

function updateTimerText(time) {
    let min = parseInt(time / 60);
    let sec = time % 60;

    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;

    gameTimer.textContent = `${min} : ${sec}`;
}

function showStopButton() {
    gameBtn.classList.remove("fa-play");
    gameBtn.classList.add("fa-square");
}

function hideGameButton() {
    gameBtn.classList.remove("fa-square");
}

function initGame() {
    score = 0;
    field.innerHTML='';
    gameScore.textContent = CARROT_COUNT;
    //벌레와 당근을 생성한뒤 field에 추가
    // console.log(fieldRect);
    addItem('carrot',CARROT_COUNT,'img/carrot.png', CARROT_SIZE);
    addItem('bug',BUG_COUNT,'img/bug.png', BUG_SIZE);
}

function addItem(className, count, imgPath, padding) {
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - padding;
    const y2 = fieldRect.height - padding;
    for (let i= 0; i < count; i++) {
        const item = document.createElement("img");
        item.setAttribute("src", imgPath);
        item.setAttribute("class",`item ${className}`);
        // item.style.position = 'absolute';
        const dx = randomNumber(x1,x2);
        const dy = randomNumber(y1,y2);
        // console.log(dx, dy);
        item.style.left = `${dx}px`;
        item.style.top = `${dy}px`;
        field.appendChild(item);
    }

}

// Any random number between min(included) and max(not included)
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// carrot/bug clicked
field.addEventListener("click", onFieldClick);

function onFieldClick(event) {
    
    if (!started) {
        return;
    }
    // console.log(event);

    const target = event.target;

    if (target.matches(".bug")) {
        playSound(bugSound);
        finishGame(false);
    } else if (target.matches(".carrot")) {
        playSound(carrotSound);
        score++;
        updateScoreBoard();
        target.remove();
        if (score === CARROT_COUNT) {
            finishGame(true);
        }
    }
}

function updateScoreBoard() {
    gameScore.innerText = CARROT_COUNT - score;
}

replayBtn.addEventListener("click",()=>{
    hidePopUp();
    startGame();
})

// bgm
bgSound.addEventListener("ended", ()=>{
    this.currentTime = 0;
    this.play();
}, false);

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