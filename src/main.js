'use strict';

import PopUp from './popup.js';
import GameBuilder from './game.js';

// 생성자 인자가 3개이상 될 경우 3,2,2로 쓰는거 비추(알아보기 힘듬)
// const game = new Game(3, 2, 2);
const game = new GameBuilder()
  .withGameDuration(30)
  .withCarrotCount(15)
  .withBugCount(10)
  .build();

const gameFinishBanner = new PopUp();

game.setGameStopListener((reason) => {
  console.log(reason);
  let message;
  switch (reason) {
    case 'cancel':
      message = 'Replay👻❓';
      break;
    case 'win':
      message = 'You Win!🥳🎉';
      break;
    case 'lose':
      message = 'You Lose!💣💥';
      break;
    default:
      throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});
