import { Sprite } from './sprite';
import { makeAndAppendCanvas } from './canvas';
import { Renderer } from './renderer';

const gameLoop = g => {
  requestAnimationFrame(() => {
    render(g);
    updateTime(g);
    gameLoop(g);
  });
};

const render = g => {
  g.r.clearScreen();
  for (const object of g.objects) {
    object.animate(g);
  }
};

/**
 * Starts the game loop, initializes the game state.
 */
export const initialize = el => {
  const canvas = makeAndAppendCanvas(el);
  const r = new Renderer(canvas);
  const g = {
    t: new Date().getTime() / 1000,
    r,
    objects: [],
    keys: {},
  };

  document.addEventListener('keydown', e => {
    g.keys[normalizeKey(e.key)] = true;
  });
  document.addEventListener('keyup', e => {
    g.keys[normalizeKey(e.key)] = false;
  });

  gameLoop(g);
};

const updateTime = g => {
  g.t = new Date().getTime() / 1000;
};

const normalizeKey = x => {
  switch (x) {
  case 'ArrowDown':
  case 's':
    return 'Down';
  case 'ArrowUp':
  case 'w':
    return 'Up';
  case 'ArrowLeft':
  case 'a':
    return 'Left';
  case 'ArrowRight':
  case 'd':
    return 'Right';
  }
  return x;
};

class Character {
  constructor(init) {
    this.x = init.x;
    this.y = init.y;
    
    this.right = init.right;
    this.left = init.left;
    this.up = init.up;
    this.down = init.down;

    this.speed = 3;

    this.d = null;
  }

  animate(g) {
    if (g.keys['Right']) {
      this.right.animate(g.r, g.t, this.x, this.y);
      this.x += this.speed;
      this.d = 'right';      
    }
    else if (g.keys['Up']) {
      this.up.animate(g.r, g.t, this.x, this.y);
      this.y -= this.speed;
      this.d = 'up';
    }
    else if (g.keys['Down']) {
      this.down.animate(g.r, g.t, this.x, this.y);
      this.y += this.speed;
      this.d = 'down';
    }
    else if (g.keys['Left']) {
      this.left.animate(g.r, g.t, this.x, this.y);
      this.x -= this.speed;
      this.d = 'left';
    } else if (this.d === null) {
      // draw an idle animation
      this.right.animate(g.r, g.t, this.x, this.y);
    } else {
      // draw the last frame used
      if (this.d === 'right')
	this.right.animate(g.r, g.t, this.x, this.y);
      else if (this.d === 'left')
	this.left.animate(g.r, g.t, this.x, this.y);
      else if (this.d === 'up')
	this.up.animate(g.r, g.t, this.x, this.y);
      else if (this.d === 'down')
	this.down.animate(g.r, g.t, this.x, this.y);
    }
  }
}
