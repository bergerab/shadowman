/**
 * 
 */
const gameLoop = g => {
  requestAnimationFrame(() => {
    g.ctx.clearRect(0, 0, g.screenWidth, g.screenHeight);
    g.wizard.animate(g);
    updateTime(g);
    gameLoop(g);
  });
};

/**
 * Starts the game loop, initializes the game state.
 */
const initializeGame = () => {
  const screen = document.getElementById('screen');
  const ctx = screen.getContext('2d');
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  const g = {
    t: new Date().getTime() / 1000,
    screen: screen,
    ctx: ctx,
    screenWidth: screen.width,
    screenHeight: screen.height,
    objects: {},
    keys: {},
  };

  document.addEventListener('keydown', e => {
    g.keys[normalizeKey(e.key)] = true;
  });
  document.addEventListener('keyup', e => {
    g.keys[normalizeKey(e.key)] = false;
  });

  Promise.all([loadSprite('sm-u.png', 6, 30, 35, 4),
	       loadSprite('sm-r.png', 6, 30, 35, 4),
	       loadSprite('sm-d.png', 6, 30, 35, 4),
	       loadSprite('sm-l.png', 6, 30, 35, 4)])
    .then(([up, right, down, left]) => {
      g.wizard = new Character({
	up, right, down, left,
	x: 0,
	y: 0,
      });
      gameLoop(g);
    });
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

/**
 * Returns a promise that resolves to an Image object.
 */
const loadImage = url => {
  const img = new Image();
  img.src = url;
  return new Promise(resolve => {
    img.onload = () => {
      resolve(img);
    }
  });
};

const loadSprite = (url, frames, width, height, scale, fps) =>
      loadImage(url).then(img => new Sprite(img, frames, width, height, scale, fps));

class Sprite {
  constructor(sheet, frames, width, height, scale=1, fps=1) {
    this.sheet = sheet;
    this.frames = frames;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.fps = fps;

    this.frame = 0; // the current frame
    this.t = null;
  }

  drawFrame(ctx, n, x=0, y=0) {
    this.frame = n;
    if (n >= this.frames) {
      console.error('Sprite was asked to draw frame ' + this.frame + ', but only has ' + this.frames + ' frames.');
      return;
    }
    ctx.drawImage(this.sheet,
		  this.width * this.frame, 0, /* the x and y coordinates on the source image */
		  this.width, this.height,
		  x, y,
		  this.width * this.scale, this.height * this.scale);
  }

  animate(ctx, t, x=0, y=0) {
    if (this.t === null) { // first render
      this.t = t;
      this.drawFrame(ctx, this.frame, x, y);
    } else if (t - this.t > 1/this.frames) { // next frame triggering
      this.t = t;
      this.frame = ++this.frame % this.frames;
      this.drawFrame(ctx, this.frame, x, y);
    } else {
      this.drawFrame(ctx, this.frame, x, y); // re-draw the current frame
    }
  }
}

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
      this.right.animate(g.ctx, g.t, this.x, this.y);
      this.x += this.speed;
      this.d = 'right';      
    }
    else if (g.keys['Up']) {
      this.up.animate(g.ctx, g.t, this.x, this.y);
      this.y -= this.speed;
      this.d = 'up';
    }
    else if (g.keys['Down']) {
      this.down.animate(g.ctx, g.t, this.x, this.y);
      this.y += this.speed;
      this.d = 'down';
    }
    else if (g.keys['Left']) {
      this.left.animate(g.ctx, g.t, this.x, this.y);
      this.x -= this.speed;
      this.d = 'left';
    } else if (this.d === null) {
      // draw an idle animation
      this.right.animate(g.ctx, g.t, this.x, this.y);
    } else {
      // draw the last frame used
      if (this.d === 'right')
	this.right.animate(g.ctx, g.t, this.x, this.y);
      else if (this.d === 'left')
	this.left.animate(g.ctx, g.t, this.x, this.y);
      else if (this.d === 'up')
	this.up.animate(g.ctx, g.t, this.x, this.y);
      else if (this.d === 'down')
	this.down.animate(g.ctx, g.t, this.x, this.y);
    }
  }
}
