import { loadImage } from './image';

export class Sprite {
  constructor({
    img,
    x, y,
    width, height,
    scale, fps=1/3,
  }) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.fps = fps; /* Only for animated sprites */
  }
}

// An animation for an object
export class Animation {
  constructor(app, keyframesName) {
    this.app = app;
    this.frame = 0; // the current frame
    this.dt = 0;

    this.keyframes = app.keyframes[keyframesName];
  }

  render(sprite, fps) {
    if (this.dt > 1/fps) { // next frame triggering
      this.dt = 0;
      this.frame = ++this.frame % this.keyframes.frameCount;
    } else {
      this.dt += this.app.dt;
    }
    drawKeyframe(this.app, this.keyframes, this.keyframes.width, this.keyframes.height, sprite.x, sprite.y, this.frame);
  }
}

function drawKeyframe(app, keyframes, width, height, x, y, n) {
  if (n >= keyframes.frameCount) {
    console.error('Sprite was asked to draw frame ' + n + ', but only has ' + frameCount + ' frames.');
    return;
  }
  app.r.drawImage(keyframes.img,
		  width * n, 0, /* the x and y coordinates on the source image */
		  width, height,
		  x, y,
		  width * keyframes.scale, height * keyframes.scale);
}
