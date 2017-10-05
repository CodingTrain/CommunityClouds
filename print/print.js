let canvas;
let canvasSvg;
let generators = [];

function setup() {
  canvas = createCanvas(1600,900);
  canvas.parent("sketch-contain");
  noLoop();
}

function draw() {
  canvasSvg = new C2S(width, height);
  canvas.drawingContext = canvasSvg;
  // Establish our default cloud drawing paremeters.
  rectMode(CORNER);
  ellipseMode(CENTER);
  angleMode(RADIANS);
  strokeWeight(10);
  // These are cached, so need to be reset
  stroke("#FFF");
  fill("#000");
  stroke("#000");
  fill("#FFF");
  var gen = random(generators);
  console.log(generators.indexOf(gen), gen);
  //gen = generators[9];
  gen.fn();

  var svg = canvasSvg.getSvg();
  document.body.appendChild(svg);
  var clientBounds = svg.getBoundingClientRect();
  var internalBounds = svg.lastChild.getBoundingClientRect();
  console.log(clientBounds, internalBounds);
  var x = clientBounds.x - internalBounds.x;
  var y = clientBounds.y - internalBounds.y;
  var scaleX = clientBounds.width / internalBounds.width;
  var scaleY = clientBounds.height / internalBounds.height;
  var scale = min(scaleX, scaleY);
  var original = svg.lastChild.getAttribute('transform') || '';
  var transform = `scale(${scale}, ${scale}) translate(${x}, ${y}) ${original}`;
  console.log(scaleX, scaleY, scale);
  console.log(transform);
  svg.lastChild.setAttribute('transform', transform);
}


// Register a new cloud generator.
function register(fn, name, creator) {
  generators.push({
    fn: fn,
    name: name,
    creator: creator
  });
}
