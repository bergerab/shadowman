export const makeCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  return canvas;
};

/**
 * Creates a new canvas, and appends it to the element.
 */
export const appendCanvas = (canvas, el) => {
  el.appendChild(canvas);
  return canvas;
};
