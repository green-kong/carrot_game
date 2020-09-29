const sound_bgm = new Audio("sound/bg.mp3");
const sound_bugPull = new Audio("sound/bug_pull.mp3");
const sound_carrotPull = new Audio("sound/carrot_pull.mp3");
const sound_win = new Audio("sound/game_win.mp3");
const sound_lose = new Audio("sound/alert.wav");

const game_field = document.querySelector(".game_field");
const game_time = document.querySelector(".game_time");
const game_message = document.querySelector(".game_message");
const game_messageText = document.querySelector(".game_message p");
const carrot_num = document.querySelector(".carrot_num");
const playBtn = document.querySelector(".game_util i");
const replayBtn = document.querySelector(".fa-redo");
const volume = document.querySelector(".volume");

let volumeon = 0;
let timer;
let time_set = 10;
let min = "";
let sec = "";

function setTimer() {
    min = parseInt(time_set / 60);
    sec = time_set % 60;

    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;

    game_time.textContent = `${min} : ${sec}`;
    time_set--;

    if (time_set < 0) {
        game_time.textContent = "시간초과";
        sound_lose.play();
        fn_gameEnd();
        game_messageText.innerText = "You Lose!💣💥";
        game_message.classList.remove("hide");
    }
}

function fn_gameStart() {
    playBtn.classList.remove("fa-play");
    playBtn.classList.add("fa-square");
    carrot_num.textContent="10";
    setTimer();
    timer = setInterval(setTimer, 1000);

    for (i=1; i<21; i++) {
        let appendData = document.createElement("img");
        appendData.setAttribute("src","img/bug.png");
        appendData.setAttribute("class","item bug");
        const dx = Math.random() * 100;
        const dy = Math.random() * 150;
        appendData.style.transform = `translate(${dx}px,${dy}px)`;
        game_field.append(appendData);
    }
    
    for (i=1; i<11; i++) {
        let appendData = document.createElement("img");
        appendData.setAttribute("src","img/carrot.png");
        appendData.setAttribute("class","item carrot");
        const dx = Math.random() * 320;
        const dy = Math.random() * 180;
        appendData.style.transform = `translate(${dx}px,${dy}px)`;
        game_field.append(appendData);
    }
}

function fn_gameEnd() {
    playBtn.classList.remove("fa-square");
    clearInterval(timer);
    time_set = 10;
}

// carrot/bug clicked
game_field.addEventListener("click",(e)=>{
   if (!e.target.classList.contains("item")) {
       return;
   }

   if (e.target.classList.contains("bug")) {
        sound_bugPull.play();
        fn_gameEnd();
        game_messageText.innerText = "You Lose!💣💥";
        game_message.classList.remove("hide");
   } else if (e.target.classList.contains("carrot")) {
        sound_carrotPull.play();
        let carrot_numUd = Number(carrot_num.innerText)-1;
        carrot_num.innerText = carrot_numUd;
        game_field.removeChild(e.target);

        if (carrot_numUd === 0) {
            sound_win.play();
            fn_gameEnd();
            game_messageText.innerText = "You Win!🥳🎉";
            game_message.classList.remove("hide");
        }
   }
})

// game start/end button
playBtn.addEventListener("click",()=>{
    if (playBtn.classList.contains("fa-play")) {
        fn_gameStart();
    } else if (playBtn.classList.contains("fa-square")) {
        sound_lose.play();
        fn_gameEnd();
        game_messageText.innerText = "Replay👻❓";
        game_message.classList.remove("hide");
    }
})

replayBtn.addEventListener("click",()=>{
    game_message.classList.add("hide");
    game_field.innerText="";
    fn_gameStart();
})

// bgm
sound_bgm.play();

sound_bgm.addEventListener("ended", ()=>{
    this.currentTime = 0;
    this.play();
}, false);

volume.addEventListener("click", ()=>{
    volume.childNodes[1].classList.toggle("hide");
    volume.childNodes[3].classList.toggle("hide");
    if (volumeon == 1) {
        sound_bgm.play();
        volumeon = 0;
    } else if (volumeon == 0) {
        sound_bgm.pause();
        volumeon = 1;
    }
});

