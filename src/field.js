'use strict';

const CARROT_SIZE = 80;
const BUG_SIZE = 50;

export default class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.field = document.querySelector(".game_field");
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener("click", this.onClick);
  }

  init() {
    this.field.innerHTML='';
    this._addItem('carrot',this.carrotCount,'img/carrot.png', CARROT_SIZE);
    this._addItem('bug',this.bugCount,'img/bug.png', BUG_SIZE);
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }
  
  _addItem(className, count, imgPath, padding) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - padding;
    const y2 = this.fieldRect.height - padding;
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
        this.field.appendChild(item);
    }
  }

  onClick = (event) => {
    const target = event.target;
    if (target.matches(".bug")) {
        this.onItemClick && this.onItemClick('bug');
    } else if (target.matches(".carrot")) {
        target.remove();
        this.onItemClick && this.onItemClick('carrot');
    }
  }
}

// Any random number between min(included) and max(not included)
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}