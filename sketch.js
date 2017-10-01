let nameInput,
    selectionInput,
    canvas,
    generators = [],
    titleElement = document.getElementById("attrib-title"),
    authorElement = document.getElementById("author-name"),
    backgroundColor = "#77B5FE";

// Resizes the canvas to match the CSS
function resize() {
    let parStyle = window.getComputedStyle(canvas.elt.parentNode),
        cWidth = parseInt(parStyle.width),
        cHeight = parseInt(parStyle.height);

    cHeight -= parseInt(parStyle.paddingTop) + parseInt(parStyle.paddingBottom);
    cWidth -= parseInt(parStyle.paddingLeft) + parseInt(parStyle.paddingRight);
    resizeCanvas(cWidth, cHeight, true);
}

// When the window resizes
function windowResized() {
    resize();
    redraw();
}

// When clicked
function mouseReleased() {
    redraw();
}

// On setup
function setup() {
    // Default canvas size
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("sketch-contain");
    // When clicked
    canvas.elt.addEventListener("click", redraw);
    noLoop();
    resize();

    // Create list of selectable items
    // Begin selectable options object
    let selectOptions = {
            "default": "random",
            "random": "Random"
        };
    // Finish populating selectOptions
    generators.forEach((n, i) => {
            selectOptions[n.name.toLowerCase()] = {
                    value: n.name,
                    group: "community"
                };
        });
    // Generate selector
    selectionInput = new MaterialSelect(selectOptions, "", true, redraw);
    // Add to clouds form
    select("#clouds-form-generator").elt.appendChild(selectionInput.nodesRef);

    // Material Design input field
    nameInput = new MaterialText("", "", "", true, "user_name", "Name", "");
    // Add to clouds form
    select("#clouds-form-options").elt.appendChild(nameInput.nodesRef);
    // Listen for value changes to redraw()
    nameInput.inputNode.addEventListener("input", redraw);
}

function updateBg(color) {
    backgroundColor = color.toHEXString();
    redraw();
}

function draw() {
    document.body.style.background = backgroundColor;
    background(backgroundColor);
    let generator;
    if(selectionInput.curOpt !== "random") {
        // Get generator chosen
        generator = generators[selectionInput.curIndex - 2];
    } else {
        // Chose a random generator
        generator = random(generators);
    }
    scale(0.5);
    translate(width * 0.5, height * 0.5);

    // Establish our default cloud drawing paremeters.
    rectMode(CORNER);
  	ellipseMode(CENTER);
    angleMode(RADIANS);
    strokeWeight(10);
    stroke("#000");
    fill("#FFF");
    // Render the chosen cloud and
    var bounds = generator.fn();

    if (bounds) {
      // Reset styles for the text
      fill(bounds.length > 4 ? bounds[4] : "#000");
      strokeWeight(0);
      textSize(16);
      textAlign(CENTER, CENTER);

      textSize(100);
      // Output the name (Hopefully within the bounds)
      let theName = nameInput.ValidInput ? nameInput.ValidInput : "Example Name";
      text(theName, bounds[0], bounds[1], bounds[2], bounds[3]);
    } else {
      console.log(generator.name + " by " + generator.creator + ", did not return bounds.")
    }
    // Describe which design
    titleElement.innerHTML = generator.name;
    authorElement.innerHTML = generator.creator;
}

// Register a new cloud generator.
function register(fn, name, creator) {
    generators.push({
            fn: fn,
            name: name,
            creator: creator
        });
}
