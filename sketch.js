let nameInput,
    selectionInput,
    canvas,
    generators = [],
    generator,
    bounds,
    formContainer = document.querySelectorAll(".form-contain")[0],
    titleElement = document.getElementById("attrib-title"),
    authorElement = document.getElementById("author-name"),
    backgroundColor = "#77B5FE",
    download = document.getElementById("download"),
    canvasSvg;

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

function handleDrawing(isSvg){
    push();

    document.getElementsByTagName("body")[0].style.background = backgroundColor;
    background(backgroundColor);

    scale(.5);
    translate(width * .5, height * .5);
    if(isSvg){
        translate(0, height * .25);
    }

    // Establish our default cloud drawing paremeters.
    rectMode(CORNER);
  	ellipseMode(CENTER);
    angleMode(RADIANS);
    strokeWeight(10);
    stroke("#000");
    fill("#FFF");
    // Render the chosen cloud and
    bounds = generator.fn();

    if (bounds) {
      // Reset styles for the text
      fill(bounds.length > 4 ? bounds[4] : "#000");
      strokeWeight(0);
      textSize(16);
      textAlign(CENTER, CENTER);

      textSize(100);
      // Output the name (Hopefully within the bounds)
      let theName = nameInput.validInput ? nameInput.validInput : "Example Name";
      text(theName, bounds[0], bounds[1], bounds[2], bounds[3]);
    } else {
      console.log(generator.name + " by " + generator.creator + ", did not return bounds.")
    }
    // Describe which design
    titleElement.innerHTML = generator.name;
    authorElement.innerHTML = generator.creator;

    pop();
}

function draw() {

    if (selectionInput.curOpt !== 'random') {
        // Get generator chosen
        generator = generators[selectionInput.curIndex - 2];
    } else {
        // Chose a random generator
        generator = random(generators);
    }

    let canStyleWidth  = parseInt(canvas.elt.style.width),
        canStyleHeight = parseInt(canvas.elt.style.height) + 200;

    let tmpContext = canvas.drawingContext;
    canvasSvg = new C2S(canStyleWidth, canStyleHeight);
    canvas.drawingContext = canvasSvg;
    handleDrawing(true);

    let theSVG   = canvasSvg.getSerializedSvg(true),
        svgBlob  = new Blob([theSVG], {type:"image/svg+xml;charset=utf-8"}),
        svgUrl   = URL.createObjectURL(svgBlob);

    download.setAttribute("href", svgUrl);
    download.setAttribute("download", generator.name.split(' ').join('_') + ".svg");

    canvas.drawingContext = tmpContext;

    loadImage(svgUrl, function(img){
        push();
        translate(0, height * -.125);
        image(img, 0, 0);
        pop();
    });

}

// Register a new cloud generator.
function register(fn, name, creator) {
    generators.push({
            fn: fn,
            name: name,
            creator: creator
        });
}
