const imageCache = {};

/**
 * Returns a promise that resolves to an Image object.
 */
export const loadImage = url => {
  if (imageCache[url] !== undefined) {
    return imageCache[url];
  }
  const img = new Image();
  img.src = url;
  return new Promise(resolve => {
    img.onload = () => {
      imageCache[url] = img;
      resolve(img);
    }
  });
};

class SMEImage {
  constructor(imgName) {
    this.img = imageCache[imgName];
    this.imgName = imgName;
  }
}

class SMESpriteKeyframes extends SMEImage {
  constructor(imgName, spriteWidth, spriteHeight, frameCount) {
    super(imgName);
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.frameCount = frameCount;
  }
}
