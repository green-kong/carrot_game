'use strict';

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector(".game_message");
    this.popUpText = document.querySelector(".game_message p");
    this.replayBtn = document.querySelector(".fa-redo");
    this.replayBtn.addEventListener('click', ()=> { 
      this.onClick && this.onClick();
      this.hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  showWithText(text) {
    this.popUpText.innerText = text;
    this.popUp.classList.remove("hide");
  }

  hide() {
    this.popUp.classList.add("hide");
  }

}

