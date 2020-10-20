'use strict';
import Field from './field.js';
import * as sound from './sound.js';

export default class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameBtn = document.querySelector('.game_util i');
    this.gameTimer = document.querySelector('.game_time');
    this.gameScore = document.querySelector('.carrot_num');

    this.gameBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop();
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

  stop() {
    this.started = false;
    sound.stopBg();
    sound.playAlert();
    this.stopGameTimer();
    this.hideGameButton();
    this.onGameStop && this.onGameStop('cancel');
  }

  finish(win) {
    this.started = false;
    this.hideGameButton();
    if (win) {
      sound.playWin();
    } else {
      sound.playBug();
    }
    this.stopGameTimer();
    sound.stopBg();
    this.onGameStop && this.onGameStop(win ? 'win' : 'lose');
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === 'bug') {
      this.finish(false);
    } else if (item === 'carrot') {
      sound.playCarrot();
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.finish(true);
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
        this.finish(this.carrotCount === this.score);
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
