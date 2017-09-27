let nameInput,
    selectionInput,
    generator_select,
    canvas,
    generators = [],
    formContainer = document.querySelectorAll(".form-contain")[0],
    aTitle = document.getElementById("aTitle"),
    aAuthor = document.getElementById("authorName"),
    canRedraw = true;

// Resizes the canvas to match the CSS
function resize() {
    let cHeight = window.innerHeight,
        cWidth = window.innerWidth > 500 ? min([window.innerWidth * .9, 960]) : window.innerWidth;
    resizeCanvas(cWidth, cHeight, false);

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
    canvas.parent("sketchContain");

    // *************************************************************************

    // Create list of selectable items
    // Begin selectable options object
    let theSelectOptions = {
        "default": "random",
        "random": "Random"
    };
    // Finish populating theSelectOptions
    for (var i = 0; i < generators.length; i++) {
        theSelectOptions[generators[i].name.toLowerCase()] = generators[i].name;
    }
    // Generate selector
    selectionInput = new MaterialSelect(theSelectOptions, "");
    // Add to clouds form
    select("#cloudsFormGenerator").elt.appendChild(selectionInput.Nodes);

    // *************************************************************************

    // Material Design input field
    nameInput = new MaterialText("", "^([A-zÀ-ž\\d\\-\\s]{1,32})$", "Character set: a-z A-Z 0-9; 1-32 characters.", true, "user_name", "Name", "");
    // Add to clouds form
    select("#cloudsFormOptions").elt.appendChild(nameInput.Nodes);
    // Listen for value changes to redraw()
    nameInput.InputNode.addEventListener("input", redraw);

    // *************************************************************************

    // Material Design input field
    colorInput = new MaterialText("", "(^[a-zA-Z]+$)|(#(?:[0-9a-fA-F]{2}){2,4}|#[0-9a-fA-F]{3}|(?:rgba?|hsla?)\\((?:\\d+%?(?:deg|rad|grad|turn)?(?:,|\\s)+){2,3}[\\s\\/]*[\\d\\.]+%?\\))", "Must be a valid color value; Hex, rgb, hsl, etc.", true, "bg_color", "Background Color", "");
    // Add to clouds form
    select("#cloudsFormOptions").elt.appendChild(colorInput.Nodes);
    // Listen for value changes to redraw()
    colorInput.InputNode.addEventListener("input", redraw);

    // *************************************************************************

    noLoop();
    resize();
}

function draw() {
    let backgroundColor = colorInput.Valid ? colorInput.ValidInput : "#77B5FE";
    document.getElementsByTagName("body")[0].style.background = backgroundColor;
    background(backgroundColor);
    var generator;
    if (selectionInput.CurOpt !== 'random') {
        // Get generator chosen
        generator = generators[selectionInput.CurIndex - 2];
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

    textSize(100);
    // Output the name (Hopefully within the bounds)
    let theName = nameInput.ValidInput ? nameInput.ValidInput : "Example Name";
    text(theName, bounds[0], bounds[1], bounds[2], bounds[3]);
    // Describe which design
    aTitle.innerHTML = generator.name;
    aAuthor.innerHTML = generator.creator;
}

// Register a new cloud generator.
function register(fn, name, creator) {
    generators.push({
        fn: fn,
        name: name,
        creator: creator
    });
}
