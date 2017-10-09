let canvas;
let canvasSvg;
let generators = [];
let addStrokeInput;

function setup() {
  canvas = createCanvas(1600,900);
  canvas.parent("sketch-contain");
  noLoop();
  // Change 9 to amount required - 1
  setTimeout(redraw, 100, 9);
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

  var xmlns = "http://www.w3.org/2000/svg";
  var svg = canvasSvg.getSvg();
  scale_svg(svg, true);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  var g = svg.lastChild;
  svg.removeChild(g);
  var container_g = document.createElementNS(xmlns, 'g');
  container_g.appendChild(g);
  svg.appendChild(container_g);


  var div = document.createElement('div');
  var controls = document.createElement('div');
  div.appendChild(controls);

  controls.innerHTML = "Add Stroke: ";
  var stroke_box = document.createElement('input');
  stroke_box.type = 'checkbox';
  controls.appendChild(stroke_box);

  controls.appendChild(document.createElement('br'));

  var remove = document.createElement('a');
  remove.innerHTML = 'Remove';
  controls.appendChild(remove);

  document.body.appendChild(div);
  div.appendChild(svg);

  stroke_box.onchange = function() {
    svg.lastChild.setAttribute('filter', this.checked ? 'url(#stroke)' : '');
  }

  remove.onclick = function() {
    document.body.removeChild(div);
    redraw();
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
