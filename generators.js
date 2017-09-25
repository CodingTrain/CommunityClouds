// Edit this file to add your cloud design!

// Just write a function with a unique name like:
// function perlinNoiseCloud() {}
// and then add a line of code that "registers" it:
// register(perlinNoiseCloud, "Perlin Noise Cloud", "Daniel Shiffman");
// Here's an example below!


// Example rounded rectangle cloud
function rectangle() {
  // Draw your cloud here
  rect(50, 50, width - 100, height - 100, 50);
  // Return an internal rectangle that it is safe to draw text within. Of the
  // form [top_left, top_right, width, height]
  return [100, 100, width - 200, height - 200];
}

// Register your function with register(function, style_name, author_name)
register(rectangle, "Example", "example");

/* ------  Add your custom cloud generators below! ------ */

function ellipseCloud() {
  const circleRadius = width / 8;

  const cloudWidth = width - 100 - circleRadius;
  const cloudHeight = height - 100 - circleRadius;

  // Getting number of circles based on the width of the cloud and the cloud radius size.
  const circleAmount = cloudWidth / (circleRadius * 0.5) * 2;

  push();
  translate(width / 2, height / 2);

  // Drawing outside circles (with stroke)
  for (let i = 0; i < circleAmount; i++) {
    drawOuterCirc(i);
  }

  // Drawing inner circles which hide the inner stroke of the outer circles
  for (let i = 0; i < circleAmount; i++) {
    drawInnerCirc(i);
  }

  // Filling the middle with white for name
  noStroke();
  ellipse(0, 0, cloudWidth, cloudHeight);
  pop();

  function drawOuterCirc(num) {
    const angle = TWO_PI / circleAmount * num;

    const circleX = cloudWidth / 2 * cos(angle);
    const circleY = cloudHeight / 2 * sin(angle);

    push();
    translate(circleX, circleY);
    ellipse(0, 0, circleRadius, circleRadius);
    pop();
  }

  function drawInnerCirc(num) {
    const angle = TWO_PI / circleAmount * num;

    // * 0.99 to still show the stroke of the outer circles
    const circleX = cloudWidth / 2 * cos(angle) * 0.99;
    const circleY = cloudHeight / 2 * sin(angle) * 0.99;

    push();
    noStroke();
    translate(circleX, circleY);
    ellipse(0, 0, circleRadius, circleRadius);
    pop();
  }

  return [100, 100, width - 200, height - 200];
}

register(ellipseCloud, "Ellipse Cloud", "Raqbit");

// Unicode Cloud by Sergio Fernández
function unicodeCloud() {
  var size = floor(min(width, height * 2));
  textSize(size);

  var widthOfCloud = size;
  var heightOfCloud = widthOfCloud * 0.37;
  var textX = (width - widthOfCloud) / 2;
  var textY = height - (height - heightOfCloud) / 2;
  textAlign(LEFT, BASELINE);
  text("☁", textX, textY);

  return [
    textX + (widthOfCloud * 0.25),
    textY - (heightOfCloud * 0.7),
    widthOfCloud * 0.6,
    heightOfCloud * 0.6
  ];
}
register(unicodeCloud, "Unicode", "Sergio Fernández");

function flatBottomCloud() {
  let radius = width / 4; // I don't really know where I messed up but for now just don't change the radius...
  let cloudWidth = width - radius - 100;
  let cloudHeight = height - radius - 100;
  let circleCount  = cloudWidth / (radius*0.5);
  
  push();
  translate(width / 2, height / 1.75);
  ellipse(0,radius/4,cloudWidth,radius);
  
  for (let i = 0; i < circleCount; i++) {
    let angle = -PI / circleCount * i;
    
    let x = cloudWidth / 2 * cos(angle);
    let y = cloudHeight / 2 * sin(angle);

    ellipse(x, y, radius, radius);
  }
  
  noStroke();
  ellipse(0, -radius/5, cloudWidth+radius/2, cloudHeight+radius/10);
  pop();

  return [100, 200, width - 200, height - 400];
}

register(flatBottomCloud, "Flat Bottom", "Merijn_DH");
