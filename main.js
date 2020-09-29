const sound_bgm = new Audio("sound/bg.mp3");
const sound_bugPull = new Audio("sound/bug_pull.mp3");
const sound_carrotPull = new Audio("sound/carrot_pull.mp3");
const sound_win = new Audio("sound/game_win.mp3");
const sound_lose = new Audio("sound/alert.wav");

const game_field = document.querySelector(".game_field");
const playBtn = document.querySelector(".game_util i");
const volume = document.querySelector(".volume");
const game_time = document.querySelector(".game_time");
const game_message = document.querySelector(".game_message");
const game_messageText = document.querySelector(".game_message p");
const carrot_num = document.querySelector(".carrot_num");
const replayBtn = document.querySelector(".fa-redo");

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

// 시간 초과했을 때
// 겜끝
// 짐 박스 보이기
    if (time_set < 0) {
        game_time.textContent = "시간초과";
        sound_lose.play();
        fn_gameEnd();
        game_messageText.innerText = "You Lose!💣💥";
        game_message.classList.remove("hide");
    }
}

// *** 게임시작
// 정지버튼으로 변경
// 타이머시작
// 당근숫자 카운트 시작
// 당근벌레 랜덤배치
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

// *** 게임끝
// 시간멈추기
function fn_gameEnd() {
    playBtn.classList.remove("fa-square");
    clearInterval(timer);
    time_set = 10;
}

// 당근/벌레 클릭시
game_field.addEventListener("click",(e)=>{
   console.log(e.target); 
   if (!e.target.classList.contains("item")) {
       return;
   }
// 벌레 클릭했을 때
// 겜끝
// 짐 박스 보이기
   if (e.target.classList.contains("bug")) {
        sound_lose.play();
        fn_gameEnd();
        game_messageText.innerText = "You Lose!💣💥";
        game_message.classList.remove("hide");
   } else if (e.target.classList.contains("carrot")) {
        sound_carrotPull.play();
        let carrot_numUd = Number(carrot_num.innerText)-1;
        carrot_num.innerText = carrot_numUd;
        game_field.removeChild(e.target);

// 모든 당근 클릭했을 때
// 겜끝
// 이긴 박스 보이기
        if (carrot_numUd === 0) {
            sound_win.play();
            fn_gameEnd();
            game_messageText.innerText = "You Win!🥳🎉";
            game_message.classList.remove("hide");
        }
   }
})

// *** 게임시작/종료버튼클릭
playBtn.addEventListener("click",()=>{
    if (playBtn.classList.contains("fa-play")) {
        fn_gameStart();
    } else if (playBtn.classList.contains("fa-square")) {
// 정지버튼 클릭했을 때
// 겜끝
// 리플레이 박스 보이기
        sound_bugPull.play();
        fn_gameEnd();
        game_messageText.innerText = "Replay👻❓";
        game_message.classList.remove("hide");
    }
})

// 리플레이함수
// 겜끝
// 게임 다시 시작(재생버튼 클릭)
replayBtn.addEventListener("click",()=>{
    game_message.classList.add("hide");
    game_field.innerText="";
    fn_gameStart();
})

// 1. bgm
sound_bgm.play();

// 무한반복재생
sound_bgm.addEventListener("ended", ()=>{
    this.currentTime = 0;
    this.play();
}, false);

volume.addEventListener("click", ()=>{
    volume.childNodes[1].classList.toggle("hide");
    volume.childNodes[3].classList.toggle("hide");
});

