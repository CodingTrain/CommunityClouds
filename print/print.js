let canvas;
let canvasSvg;
let generators = [];
let current = null;
let addStrokeInput;

function setup() {
  canvas = createCanvas(1600,900);
  canvas.parent("sketch-contain");
  addStrokeInput = document.querySelector('#add-stroke');
  addStrokeInput.addEventListener('change', stroke_change);
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

  // Add a stroke filter
  var defs = svg.firstChild;
  defs.innerHTML = `
  <filter id="f1">
    <feGaussianBlur result="background-prev" stdDeviation="1"/>
    <feColorMatrix result="background" in="background-prev"
      type="matrix"
      values="0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 100 0" />
    <feOffset result="foreground" in="SourceGraphic" dx="0" dy="0" />
    <feBlend in="foreground" in2="background" mode="normal" />
  </filter>`;

  if(random() < 0.5) {
    console.log("Adding shadow");
  }
  scale_svg(svg, true);


  document.body.appendChild(svg);
  current = {
    svg: svg,
    generator: gen,
  };
  stroke_change();
}

function stroke_change(ev) {
  if(current == null) return;
  if(addStrokeInput.checked) {
    current.svg.lastChild.setAttribute('filter', 'url(#f1)');
  } else {
    current.svg.lastChild.setAttribute('filter', '');
  }
}

function scale_svg(svg, append, margin) {
  if(append) {
    document.body.appendChild(svg);
  }
  margin = 50 || margin;
  var clientBounds = svg.getBoundingClientRect();
  var internalBounds = svg.lastChild.getBoundingClientRect();
  console.log(clientBounds, internalBounds);
  var x = clientBounds.x - internalBounds.x + margin;
  var y = clientBounds.y - internalBounds.y + margin;
  var scaleX = clientBounds.width / (internalBounds.width + 2 * margin);
  var scaleY = clientBounds.height / (internalBounds.height + 2 * margin);
  var scale = min(scaleX, scaleY);
  var original = svg.lastChild.getAttribute('transform') || '';
  var transform = `scale(${scale}, ${scale}) translate(${x}, ${y}) ${original}`;
  console.log(scaleX, scaleY, scale);
  console.log(transform);
  svg.lastChild.setAttribute('transform', transform);
  if(append) {
    document.body.removeChild(svg);
  }
}


// Register a new cloud generator.
function register(fn, name, creator) {
  generators.push({
    fn: fn,
    name: name,
    creator: creator
  });
}
