let canvas;
let canvasSvg;
let generators = [];

let currentSvg;
let container;
let generatorSelect;
let sizeAdjust;
let filterSelect;
let backgroundSelect;
let addToPage;

let currentPage;
let pageContainer;

const outputWidth = 1200;
const outputHeight = 900;

function setup() {
  container = document.getElementById('svg-contain');
  sizeAdjust = document.getElementById('size-adjust');
  generatorSelect = document.getElementById('generator');
  filterSelect = document.getElementById('filter');
  backgroundSelect = document.getElementById('background');
  pageContainer = document.getElementById('pages');
  addToPage = document.getElementById('add-to-page');

  currentPage = new_page();

  let scale = 0.1 + sizeAdjust.value / 100;
  canvas = createCanvas(1200 * scale, 900 * scale);
  canvas.parent("sketch-contain");
  noLoop();

  sizeAdjust.onchange = function() {
    let scale = 0.1 + sizeAdjust.value / 100;
    resizeCanvas(1200 * scale, 900 * scale);
  }

  generators.forEach(function(gen, i) {
    let elem = document.createElement('option');
    elem.value = i;
    elem.innerHTML = gen.name;
    generatorSelect.appendChild(elem);
  });

  generatorSelect.onchange = redraw;

  filterSelect.onchange = applyFilter;

  container.className = backgroundSelect.value;
  backgroundSelect.onchange = function() {
    container.className = backgroundSelect.value;
  }

  addToPage.onclick = add_to_page;
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
  gen = generators[generatorSelect.value];
  console.log(generators.indexOf(gen), gen);
  gen.fn();

  var xmlns = "http://www.w3.org/2000/svg";
  currentSvg = canvasSvg.getSvg();
  currentSvg.setAttribute('width', outputWidth);
  currentSvg.setAttribute('height', outputHeight);
  scale_svg(currentSvg, true);
  currentSvg.setAttribute('viewBox', `0 0 ${outputWidth} ${outputHeight}`);
  var g = currentSvg.lastChild;
  currentSvg.removeChild(g);
  var container_g = document.createElementNS(xmlns, 'g');
  container_g.appendChild(g);
  currentSvg.appendChild(container_g);

  applyFilter();

  while(container.lastChild) {
    container.removeChild(container.lastChild);
  }
  container.appendChild(currentSvg);
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

function applyFilter() {
  if(filterSelect.value !== 'none') {
    currentSvg.lastChild.setAttribute('filter', `url(#${filterSelect.value})`);
  } else {
    currentSvg.lastChild.setAttribute('filter', '');
  }
}

function new_page() {
  let template = document.getElementById('page-template').cloneNode(true);
  template.id = "";
  let anchor = document.createElement('a');
  anchor.target = "_blank";
  anchor.appendChild(template);
  pageContainer.appendChild(anchor);
  let page = {
    a: anchor,
    elements: 0,
    svg: template,
  };
  update_link(page);
  return page;
}

function update_link(page) {
  let blob = new Blob([page.svg.outerHTML], {type:"image/svg+xml;charset=utf-8"});
  let svgUrl   = URL.createObjectURL(blob);
  page.a.href = svgUrl;
}

function add_to_page() {
  let id = currentPage.elements;
  let offsetX = (id % 2) * outputWidth;
  let offsetY = Math.floor(id / 2) * outputHeight;
  let newPart = currentSvg.lastChild.cloneNode(true);
  currentPage.svg.appendChild(newPart);
  newPart.setAttribute('transform', `translate(${offsetX}, ${offsetY})`);
  update_link(currentPage);
  currentPage.elements += 1;
  if(currentPage.elements === 6) {
    currentPage = new_page();
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
