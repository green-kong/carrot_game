'use strict';

import PopUp from './popup.js';
import Game from './game.js';

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(()=>{
    startGame();
});

const game = new Game(3,2,2);
game.setGameStopListener(reason => {
    console.log(reason)
})

