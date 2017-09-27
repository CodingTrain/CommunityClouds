let nameInput,
    selectionInput,
    generator_select,
    canvas,
    generators = [],
    formContainer = document.querySelectorAll(".form-contain")[0],
    aTitle = document.getElementById("aTitle"),
    aAuthor = document.getElementById("authorName"),
    canRedraw = true,
    backgroundColor = "#77B5FE";

// Resizes the canvas to match the CSS
function resize() {
    let canParentStyle = window.getComputedStyle(canvas.elt.parentNode),
        cWidth  = parseInt(canParentStyle.width),
        cHeight = parseInt(canParentStyle.height);

        cHeight -= parseInt(canParentStyle.paddingTop) + parseInt(canParentStyle.paddingBottom);
        cWidth  -= parseInt(canParentStyle.paddingLeft) + parseInt(canParentStyle.paddingRight);
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
    selectionInput = new MaterialSelect(theSelectOptions, "", redraw);
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

    noLoop();
    resize();
}

function updateBg(color){
    backgroundColor = color.toHEXString();
    redraw();
}

function draw() {
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
    scale(.5);
    translate(width * .5, height * .5);

    // Establish our default cloud drawing paremeters.
    angleMode(RADIANS);
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
