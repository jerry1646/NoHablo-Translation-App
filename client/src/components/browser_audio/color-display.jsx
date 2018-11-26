// the canvas size
const WIDTH = 1000;
const HEIGHT = 400;

const ctx = canvas.getContext("2d");
console.log(canvas);
// options to tweak the look
const opts = {
  smoothing: 0.6,
  fft: 5,
  minDecibels: -70,
  scale: 0.2,
  glow: 10,
  color1: [203, 36, 128],
  color2: [41, 200, 192],
  color3: [24, 137, 218],
  fillOpacity: 0.6,
  lineWidth: 1,
  blend: "screen",
  shift: 50,
  width: 60,
  amp: 1
};

// Interactive dat.GUI controls
const gui = new dat.GUI();

// hide them by default
gui.close();

// connect gui to opts
gui.addColor(opts, "color1");
gui.addColor(opts, "color2");
gui.addColor(opts, "color3");
gui.add(opts, "fillOpacity", 0, 1);
gui.add(opts, "lineWidth", 0, 10).step(1);
gui.add(opts, "glow", 0, 100);
gui.add(opts, "blend", [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "lighten",
  "difference"
]);
gui.add(opts, "smoothing", 0, 1);
gui.add(opts, "minDecibels", -100, 0);
gui.add(opts, "amp", 0, 5);
gui.add(opts, "width", 0, 60);
gui.add(opts, "shift", 0, 200);


const context = new AudioContext();
const analyser = context.createAnalyser();

// Array to hold the analyzed frequencies
const freqs = new Uint8Array(analyser.frequencyBinCount);

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

navigator.getUserMedia({ audio: true }, onStream, onStreamError);

/**
 * Create an input source from the user media stream, connect it to
 * the analyser and start the visualization.
 */
function onStream(stream) {
  const input = context.createMediaStreamSource(stream);
  input.connect(analyser);
  requestAnimationFrame(visualize);
}

/**
 * Display an error message.
 */
function onStreamError(e) {
  document.body.innerHTML = "<h1>This pen only works with https://</h1>";
  console.error(e);
}

/**
 * Utility function to create a number range
 */
function range(i) {
  return Array.from(Array(i).keys());
}

// shuffle frequencies so that neighbors are not too similar
const shuffle = [1, 3, 0, 4, 2];

/**
 * Pick a frequency for the given channel and value index.
 *
 * The channel goes from 0 to 2 (R/G/B)
 * The index goes from 0 to 4 (five peaks in the curve)
 *
 * We have 32 (2^opts.fft) frequencies to choose from and
 * we want to visualize most of the spectrum. This function
 * returns the bands from 0 to 28 in a nice distribution.
 */
function freq(channel, i) {
  const band = 2 * channel + shuffle[i] * 6;
  return freqs[band];
}

/**
 * Returns the scale factor fot the given value index.
 * The index goes from 0 to 4 (curve with 5 peaks)
 */
function scale(i) {
  const x = Math.abs(2 - i); // 2,1,0,1,2
  const s = 3 - x;           // 1,2,3,2,1
  return s / 3 * opts.amp;
}

/**
 *  This function draws a path that roughly looks like this:
 *       .
 * __/\_/ \_/\__
 *   \/ \ / \/
 *       '
 *   1 2 3 4 5
 *
 * The function is called three times (with channel 0/1/2) so that the same
 * basic shape is drawn in three different colors, slightly shifted and
 * each visualizing a different set of frequencies.
 */
function path(channel) {

  // Read color1, color2, color2 from the opts
  const color = opts[`color${channel + 1}`].map(Math.floor);
  console.log(color);
  // turn the [r,g,b] array into a rgba() css color
  ctx.fillStyle = `rgba(${color}, ${opts.fillOpacity})`;

  // set stroke and shadow the same solid rgb() color
  ctx.strokeStyle = ctx.shadowColor = `rgb(${color})`;

  ctx.lineWidth = opts.lineWidth;
  ctx.shadowBlur = opts.glow;
  ctx.globalCompositeOperation = opts.blend;

  const m = HEIGHT / 2; // the vertical middle of the


  // for the curve with 5 peaks we need 15 control points

  // calculate how much space is left around it
  const offset = (WIDTH - 15 * opts.width) / 2;

  // calculate the 15 x-offsets
  const x = range(15).map(
    i => offset + channel * opts.shift + i * opts.width
  );

  // pick some frequencies to calculate the y values
  // scale based on position so that the center is always bigger
  const y = range(5).map(i =>
    Math.max(0, m - scale(i) * freq(channel, i))
  );

  const h = 2 * m;

  ctx.beginPath();
  ctx.moveTo(0, m); // start in the middle of the left side
  ctx.lineTo(x[0], m + 1); // straight line to the start of the first peak

  ctx.bezierCurveTo(x[1], m + 1, x[2], y[0], x[3], y[0]); // curve to 1st value
  ctx.bezierCurveTo(x[4], y[0], x[4], y[1], x[5], y[1]); // 2nd value
  ctx.bezierCurveTo(x[6], y[1], x[6], y[2], x[7], y[2]); // 3rd value
  ctx.bezierCurveTo(x[8], y[2], x[8], y[3], x[9], y[3]); // 4th value
  ctx.bezierCurveTo(x[10], y[3], x[10], y[4], x[11], y[4]); // 5th value

  ctx.bezierCurveTo(x[12], y[4], x[12], m, x[13], m); // curve back down to the middle

  ctx.lineTo(1000, m + 1); // straight line to the right edge
  ctx.lineTo(x[13], m - 1); // and back to the end of the last peak

  // now the same in reverse for the lower half of out shape

  ctx.bezierCurveTo(x[12], m, x[12], h - y[4], x[11], h - y[4]);
  ctx.bezierCurveTo(x[10], h - y[4], x[10], h - y[3], x[9], h - y[3]);
  ctx.bezierCurveTo(x[8], h - y[3], x[8], h - y[2], x[7], h - y[2]);
  ctx.bezierCurveTo(x[6], h - y[2], x[6], h - y[1], x[5], h - y[1]);
  ctx.bezierCurveTo(x[4], h - y[1], x[4], h - y[0], x[3], h - y[0]);
  ctx.bezierCurveTo(x[2], h - y[0], x[1], m, x[0], m);

  ctx.lineTo(0, m); // close the path by going back to the start

  ctx.fill();
  ctx.stroke();
}

/**
 * requestAnimationFrame handler that drives the visualization
 */
function visualize() {
  // set analysert props in the loop react on dat.gui changes

  analyser.smoothingTimeConstant = opts.smoothing;
  analyser.fftSize = Math.pow(2, opts.fft);
  analyser.minDecibels = opts.minDecibels;
  analyser.maxDecibels = 0;
  analyser.getByteFrequencyData(freqs);

  // set size to clear the canvas on each frame
  canvas.width = WIDTH;
  canvas.height = HEIGHT;


  // draw three curves (R/G/B)
  path(0);
  path(1);
  path(2);

  // schedule next paint
  requestAnimationFrame(visualize);
}

