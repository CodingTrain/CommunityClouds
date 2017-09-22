var name_input;
var generator_select;
var canvas = null;
var generators = [];

// Resizes the canvas to match the CSS
function resize() {
  var container = canvas.elt.getBoundingClientRect();
  resizeCanvas(container.width, container.height, false);
}

// When the window resizes
function windowResized() {
  resize();
  redraw();
}

// When clicked
function mousePressed() {
  redraw();
}

// On setup
function setup() {
  // Default canvas size
  canvas = createCanvas(1200, 1200);
  name_input = createInput('Your Name');

  // Create the generator selection
  generator_select = createSelect();
  generator_select.option('Random', 'random');
  for(var i = 0; i < generators.length; i++) {
    generator_select.option(generators[i].name, i);
  }

  // Disable re-rendering when unnecessary
  noLoop();

  // Render again when inputs change
  name_input.input(redraw);
  generator_select.changed(redraw);
  resize();
}

function draw() {
  background("#77B5FE");
  var generator;
  var selected = (generator_select.value());
  if (selected !== 'random') {
    // Get generator chosen
    generator = generators[+selected];
  } else {
    // Chose a random generator
    generator = random(generators);
  }
  // Establish our default cloud drawing paremeters.
  strokeWeight(10);
  stroke("#000");
  fill("#FFF");
  // Render the chosen cloud and
  var bounds = generator.fn();
  // Reset styles for the text
  fill("#000");
  strokeWeight(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  // Describe which design
  text(generator.name + " by " + generator.creator, 0, height - 16, width, 16);
  textSize(100);
  // Output the name (Hopefully within the bounds)
  text(name_input.value(), bounds[0], bounds[1], bounds[2], bounds[3]);
}

// Register a new cloud generator.
function register(fn, name, creator) {
  generators.push({
    fn: fn,
    name: name,
    creator: creator
  });
}
