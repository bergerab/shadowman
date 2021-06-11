import { Sprite, Animation } from './sprite';
import { makeCanvas, appendCanvas } from './canvas';
import { Renderer } from './renderer';
import { loadImage } from './image';

const gameLoop = app => {
  const t0 = new Date().getTime()/1000;  
  requestAnimationFrame(() => {
    app.dt = (new Date().getTime()/1000) - t0;
    render(app);
    gameLoop(app);
  });
};

const render = g => {
  g.r.clearScreen();
  for (const object of g.objects) {
    object.animate(g);
  }
};

export class App {
  constructor() {
    this.defaultImageDirectory = '';
    this.defaultImageFiletype = '';
    this.imageUrls = [];
    this.keyframes = {}
    this.images = {};

    this.canvas = makeCanvas();
    this.r = new Renderer(this.canvas);

    this.objects = [];
    this.keys = {};

    this.dt = 0;
  }

  getKeyframes(name) {
    return this.keyframes[name];
  }

  loadImage(url) {
    if (this.images[url] !== undefined) {
      return this.images[url];
    }
    const img = new Image();
    img.src = url;
    return new Promise(resolve => {
      img.onload = () => {
	this.images[url] = img;
	resolve(img);
      }
    });
  };

  setAntiAliasing(enabled) {
    this.r.antiAlias(enabled);
    return this;
  }
  
  setDefaultImageDirectory(defaultImageDirectory) {
    this.defaultImageDirectory = defaultImageDirectory;
    return this;
  }

  setDefaultImageFiletype(defaultImageFiletype) {
    this.defaultImageFiletype = defaultImageFiletype;
    return this;
  }

  resolveUrl(url) {
    return this.defaultImageDirectory + url + this.defaultImageFiletype;
  }
  
  addImages(urls) {
    this.imageUrls = this.imageUrls.concat(urls.map(url => this.resolveUrl(url)));
    return this;
  }

  addObject(object) {
      this.objects.push(object);
    }

    addKeyframes({ name, url, width, height, frameCount, scale, }) {
    if (name === undefined) {
      name = url;
    }
    this.addImages([url]);
    this.keyframes[name] = { name, url, width, height, frameCount, scale };
    return this;
  }

  initialize(el) {
    appendCanvas(this.canvas, el);
    return Promise.all(this.imageUrls.map(url => this.loadImage(url))).then(() => {
      /* Set "img" on all keyframes. */
      for (const keyframeName in this.keyframes) {
	const keyframes = this.keyframes[keyframeName];
	keyframes.img = this.images[this.resolveUrl(keyframes.url)];
      }
      document.addEventListener('keydown', e => {
	this.keys[normalizeKey(e.key)] = true;
      });
      document.addEventListener('keyup', e => {
	this.keys[normalizeKey(e.key)] = false;
      });
      gameLoop(this);
      return this;
      });
    };
}

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

export class Character {
  constructor(app, init) {
    this.x = init.x;
    this.y = init.y;

    this.right = new Animation(app, init.right);
    this.left = new Animation(app, init.left);
    this.up = new Animation(app, init.up);
    this.down = new Animation(app, init.down);
    this.idleRight = new Animation(app, 'sm/idle-right');
    this.idleLeft = new Animation(app, 'sm/idle-left');    
    this.idleDown = new Animation(app, 'sm/idle-down');
    this.idleUp = new Animation(app, 'sm/idle-up');                

    this.speed = 3;

    this.d = null;
  }

  animate(app) {
    if (app.keys['Right']) {
      this.right.render(this, 10);
      this.x += this.speed;
      this.d = 'right';      
    }
    else if (app.keys['Up']) {
      this.up.render(this, 10);      
      this.y -= this.speed;
      this.d = 'up';
    }
    else if (app.keys['Down']) {
      this.down.render(this, 10);       
      this.y += this.speed;
      this.d = 'down';
    }
    else if (app.keys['Left']) {
      this.left.render(this, 10);             
      this.x -= this.speed;
      this.d = 'left';
    } else if (this.d === null) {
      // draw an idle animation
      this.idleRight.render(this, 1);                   
    } else {
      // draw the last frame used
      if (this.d === 'right')
	this.idleRight.render(this, 1);                   	
      else if (this.d === 'left')
	this.idleLeft.render(this, 1);                   		
      else if (this.d === 'up')
	this.idleUp.render(this, 1);                   			
      else if (this.d === 'down')
	this.idleDown.render(this, 1);
    }
  }
}

export { Sprite } from './sprite';
