'use strict';
import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

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

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.field = new Field(this.carrotCount, this.bugCount);
    this.field.setClickListener(this.onItemClick);
    this.gameBtn = document.querySelector('.game_util i');
    this.gameTimer = document.querySelector('.game_time');
    this.gameScore = document.querySelector('.carrot_num');

    this.gameBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop(Reason.cancel);
        sound.playAlert();
      } else {
        this.start();
      }
    });

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
    if (reason === Reason.win) {
      sound.playWin();
    } else if (reason === Reason.lose) {
      sound.playBug();
    }
    this.onGameStop && this.onGameStop(reason);
  }

  initGame() {
    this.score = 0;
    this.gameScore.textContent = this.carrotCount;
    this.field.init();
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.bug) {
      this.stop(Reason.lose);
    } else if (item === ItemType.carrot) {
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

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }

  showStopButton() {
    this.gameBtn.classList.remove('fa-play');
    this.gameBtn.classList.add('fa-square');
  }

  hideGameButton() {
    this.gameBtn.classList.remove('fa-square');
  }

  updateTimerText(time) {
    let min = parseInt(time / 60);
    let sec = time % 60;

    if (min < 10) min = '0' + min;
    if (sec < 10) sec = '0' + sec;

    this.gameTimer.textContent = `${min} : ${sec}`;
  }
}
