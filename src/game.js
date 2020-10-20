'use strict';
import Field from './field.js';
import * as sound from './sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

// Builder Pattern
export class GameBuilder {
  // builder 클래스의 함수는 builder 오브젝트 자체를 리턴하기 때문에
  // 일반적인 setter함수와 구분하기 위해 with* (add* set*) 을 붙여서 쓴다
  withGameDuration(duration) {
    this.gameDuration = duration;
    return this; // array처럼 class자체를 다시 리턴하여 chaining가능하도록
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    console.log(this);
    return new Game(
      this.gameDuration, //
      this.carrotCount,
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameBtn = document.querySelector('.game_util i');
    this.gameTimer = document.querySelector('.game_time');
    this.gameScore = document.querySelector('.carrot_num');

    this.gameBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.field = new Field(this.carrotCount, this.bugCount);
    this.field.setClickListener(this.onItemClick);

    this.started = false;
    this.timer = undefined;
    this.score = 0;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.startGameTimer();
    sound.playBg();
  }

  stop(reason) {
    this.started = false;
    sound.stopBg();
    this.stopGameTimer();
    this.hideGameButton();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === 'bug') {
      this.stop(Reason.lose);
    } else if (item === 'carrot') {
      sound.playCarrot();
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    }
  };

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 1) {
        this.gameTimer.textContent = '시간초과';
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    let min = parseInt(time / 60);
    let sec = time % 60;

    if (min < 10) min = '0' + min;
    if (sec < 10) sec = '0' + sec;

    this.gameTimer.textContent = `${min} : ${sec}`;
  }

  showStopButton() {
    this.gameBtn.classList.remove('fa-play');
    this.gameBtn.classList.add('fa-square');
  }

  hideGameButton() {
    this.gameBtn.classList.remove('fa-square');
  }

  initGame() {
    this.score = 0;
    this.gameScore.textContent = this.carrotCount;
    this.field.init();
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
}
