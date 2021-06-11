/**
 * An abstraction that hides which API is used to render to the screen.
 * (in case WebGL or WebGPU support is needed)
 * Provides an interface for only a small set of operations.
 */
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  screenWidth() { return this.canvas.width; }
  screenHeight() { return this.canvas.height; }

  antiAlias(enabled) {
    this.ctx.webkitImageSmoothingEnabled = enabled;
    this.ctx.mozImageSmoothingEnabled = enabled;
    this.ctx.imageSmoothingEnabled = enabled;
    return this;
  }

  drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }

  clearScreen() {
    this.ctx.clearRect(0, 0, this.screenWidth(), this.screenHeight());
  }
}
