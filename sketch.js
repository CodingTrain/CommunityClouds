let nameInput,
    generator_select,
    canvas,
    generators = [],
    formContainer = document.querySelectorAll(".form-contain")[0],
    aTitle = document.getElementById("aTitle"),
    aAuthor = document.getElementById("authorName"),
    canRedraw = true;

// Resizes the canvas to match the CSS
function resize() {
    let cHeight = window.innerHeight - formContainer.clientHeight,
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

    // Create list of selectable items

    // Default random selection
    let randOpt = createElement('li', 'Random');
    randOpt.parent(selectInputAll[0]);
    randOpt.elt.setAttribute('data-option-val', 'random');
    randOpt.elt.setAttribute('data-option-selected', true);


    for (var i = 0; i < generators.length; i++) {
        let tmp = createElement('li', generators[i].name);
        tmp.parent(selectInputAll[0]);
        tmp.elt.setAttribute('data-option-val', generators[i].name.toLowerCase());
    }


    // Material Design input field
    nameInput = new MaterialText("Input your name to preview it in the image.", "^([A-zÀ-ž\\d\\-\\s]{1,32})$", "Character set: a-z A-Z 0-9; 1-32 characters.", true, "user_name", "Name", "");
    // Add to clouds form
    select("#cloudsForm").elt.appendChild(nameInput.Nodes);
    // Listen for value changes to redraw()
    nameInput.InputNode.addEventListener("input", redraw);

    noLoop();
    resize();
}

function draw() {
    background(255, 255, 255);
    var generator;
    var selected = selectedOption(selectInputAll[0]);
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

    textSize(100);
    // Output the name (Hopefully within the bounds)
    text(nameInput.Value, bounds[0], bounds[1], bounds[2], bounds[3]);
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
