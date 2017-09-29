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

function kazakhCloud(radius = 200, min = 8, max = 10) {
    // This function draws a cloud which margins are inside of a "circle" with
    // a given radius. The circle is not perfect, its boundaries may vary
    // according to the value offset. Number of "peak" points is determined via
    // min and max values.
    let points = [];
    let offset = radius / 5;
    let numPoints = Math.round(Math.random()*(max-min)+min);
    for (let i = 0; i < numPoints; i++) {
        // generating "peak" points of a cloud away from the center
        let angle = (TWO_PI / numPoints) * i;
        let away;
        while (true) {
            away = Math.round(Math.random() * radius + offset);
            if (Math.abs(away - radius) <= offset) {
                break;
            }
        }
        let x = width / 2 + away * Math.cos(angle);
        let y = height / 2 - away * Math.sin(angle);
        points.push([x, y]);
    }
    noStroke();
    fill("#FFF");
    ellipse(width / 2, height / 2, 2.3*radius, 2.3*radius);
    for (let i = 0; i < points.length; i++) {
        // drawing arcs with the center inbetween every pair of points
        let center = [];
        let circleRadius;
        if (i == points.length - 1) {
            center = [(points[i][0] + points[0][0]) / 2, (points[i][1] + points[0][1]) / 2];
            circleRadius = dist(points[i][0], points[i][1], points[0][0], points[0][1]);
        } else {
            center = [(points[i][0] + points[i+1][0]) / 2, (points[i][1] + points[i+1][1]) / 2];
            circleRadius = dist(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
        }
        // finding slope and y-intercept for a line between center and point
        let mCircle = (center[1] - points[i][1]) / (center[0] - points[i][0]);
        let bCircle = center[1] - mCircle * center[0];
        let x1Origin = (0 - bCircle) / mCircle; // finding line's intercept with X-axis
        let x2Origin = center[0]; // another line is a projection of previous on X
        // finally getting the angle using found 2 lines and trigonometry
        let angle = Math.acos(dist(x2Origin, 0, x1Origin, 0) / dist(center[0], center[1], x1Origin, 0));
        // drawing arcs with right angle offset according to the placement of the center
        strokeWeight(10);
        stroke("#000");
        fill("#FFF");
        if (center[0] > width / 2 && center[1] < height / 2) {
            arc(center[0], center[1], circleRadius, circleRadius, PI+angle, angle);
        } else if (center[0] < width / 2 && center[1] < height / 2) {
            arc(center[0], center[1], circleRadius, circleRadius, PI-angle, -angle);
        } else if (center[0] < width / 2 && center[1] > height / 2) {
            arc(center[0], center[1], circleRadius, circleRadius, angle, PI+angle);
        } else if (center[0] > width / 2 && center[1] > height / 2) {
            arc(center[0], center[1], circleRadius, circleRadius, -angle, PI-angle);
        } else if (center[0] == width / 2 && center[1] < height / 2) {
            arc(center[0], center[1], circleRadius, circleRadius, PI, 0);
        } else if (center[0] == width / 2 && center[1] > height / 2) {
            arc(center[0], center[1], circleRadius, circleRadius, 0, PI);
        } else if (center[0] < width / 2 && center[1] == height / 2) {
            arc(center[0], center[1], circleRadius, circleRadius, HALF_PI, PI + HALF_PI);
        } else if (center[0] > width / 2 && center[1] == height / 2) {
            arc(center[0], center[1], circleRadius, circleRadius, PI + HALF_PI, HALF_PI);
        }
    }
    let rectSide = Math.round(Math.sqrt(2) * (radius - offset));
    return [width/2 - rectSide/2, height/2 - rectSide/2, radius+offset, radius+offset];
}

register(kazakhCloud, "Cloud from Kazakhstan", "Ilyas triple-o-zero");

function fluffyCloud(){
  var cloudradius = 0.7*(width/2);
  var angle = PI/2;
  fill(255);
  while(angle<(2.5*PI)){
    ellipse(width/2+cos(angle)*cloudradius,height/2+sin(angle)*0.5*cloudradius,(width/2-sin(angle)*cloudradius)/3);
    angle += (width/2-sin(angle)*cloudradius)/(3.9*cloudradius);
  }
  noStroke();
  ellipse(width/2-4,height/2-cloudradius*0.075,cloudradius*2.4,cloudradius*1.24);
  stroke(0);
  return [120, 180, width - 240, height - 400];
}

register(fluffyCloud, "Fluffy", "egg303");

//Draw a nice round cloud by Brandon Blaschke
function proudRoundCloud() {

  //Amount of circles in the cloud
  let circleAmou = 15;

  //Radius for surrounding clouds
  let radius = 200;

  strokeWeight(5);
  fill(255);

  //Position and set up drawing
  push();
  angleMode(DEGREES);
  translate(width / 2, height / 2);

  //Make outer edge of cloud by going in a circle around the name
  for(let i = 0; i < circleAmou; i++) {
    let angle = map(i, 0, circleAmou, 0, 360);
    let x = 400 * cos(angle);
    let y = 250 * sin(angle);
    ellipse(x,y, radius, radius);
  }

  //Fill the inside with white circles to fill it
  noStroke();
  for(let i = 0; i < circleAmou; i++) {
    let angle = map(i, 0, circleAmou, 0, 360);
    let x = 200 * cos(angle);
    let y = 200 * sin(angle);
    ellipse(x,y, radius, radius);
  }

  //Fill the middle section
  ellipse(0,0,950, 550);
  pop();

  return [100, 100, width - 200, height - 200];
}

register(proudRoundCloud, "Proud Round Cloud", "Brandon Blaschke");

// rndCloud
// Generates a cloud, by drawing ellipses of random width and height on locus of a regular ellipse
// Couldn't add a nice looking stroke to the cloud :( TODO: Add a beautiful stroke
function rndCloud(){
  // Randomess - The main variable of the algorithm.
  // Randomness is inversely proportional to time taken to generate
  // Randomness is directly proportional to beauty (depends on viewers taste)

  const randomness = random(20,100);
  const r = width/2 - randomness;
  let x, y;
  push();
    translate(width / 2, height / 2);
    angleMode(DEGREES)
    noStroke();
    for(let i = 0; i <=360;)
        {
          x = r*cos(i);
          y = 0.5* r*sin(i);
          w = random(1,2) * randomness;
          h = random(1,2) * randomness;
            ellipse(x,y,w,h); //Draw the random ellipses
            ellipse(0,0,r*2,r); //Draw main ellipse
          i += randomness / 10;
        }
  pop();
  return [100, 100, width - 200, height - 200];
}

register(rndCloud, "RNDCloud", "Haider Ali Punjabi (@haideralipunjabi)")

function cartoonCloud() {
  //Inspired by the cloud drawing from Processing Day organizer Taeyoon Choi
  function getRandMiniA() {
    return random(0, PI/24);
  }
  let radius = height/2.4;
  let angles = [0];
  angleMode(RADIANS);

  push();
  translate(width/2, height/2);

  //Fills the array with random angles that progressivly get bigger up until 2*PI
  //This creates the bigger and smaller cloud blobs, making it feel more natural
  let totalA = 0;
  while (totalA < 2*PI) {
    let a = random(PI/20, PI/6);
    if (totalA + a > 2*PI) {
      a = 2*PI - totalA;
    }
    totalA += a;
    angles.push(totalA);
  }

  //We first draw the cloud using begin/endShape() so we can fill() it
  noStroke();
  fill(255);
  beginShape();
  vertex(2*radius*cos(angles[0]), 2*radius*sin(angles[0]));
  for (let i = 0; i < angles.length; i++) {
    let a = angles[i];
    let deltaA = angles[(i+1)%angles.length] - a;
    if (deltaA < 0)deltaA+=2*PI;
    bezierVertex(
      2*1.2*radius*cos(a + deltaA/3), 1.2*radius*sin(a + deltaA/3),
      2*1.2*radius*cos(a + 2*deltaA/3), 1.2*radius*sin(a + 2*deltaA/3),
      2*radius*cos(angles[(i+1)%angles.length]), radius*sin(angles[(i+1)%angles.length])
    );
  }
  endShape();

  //Now we draw the cloud 4 times, each time with a random offset
  //This gives the cloud a cartoony feeling
  stroke(0, 200);
  for (let l = 0; l < 4; l++) {
    for (let i = 0; i < angles.length; i++) {
      //Draw a bezier curve with a random stroke, a touch of alpha and some RNG
      let a = angles[i];
      let deltaA = angles[(i+1)%angles.length] - a;
      if (deltaA < 0){deltaA+=2*PI;}
      strokeWeight(random(1,4));
      bezier(
        2*radius*cos(a), radius*sin(a),
        2*1.2*radius*cos(a + deltaA/3- getRandMiniA()), 1.2*radius*sin(a + deltaA/3- getRandMiniA()),
        2*1.2*radius*cos(a + 2*deltaA/3+ getRandMiniA()), 1.2*radius*sin(a + 2*deltaA/3+ getRandMiniA()),
        2*radius*cos(angles[(i+1)%angles.length]), radius*sin(angles[(i+1)%angles.length])
      );
    }
  }
  pop();
  return [width/2 - 2*radius/1.4, height/2 - radius / 1.4, 4 * radius / 1.4, 2 * radius / 1.4];
}

register(cartoonCloud, "Cartoon cloud", "@JeBoyJurriaan");

/**
 * To dra a square cloud composed of other squares
 */
function squareBlueCloud()
{
  
  noStroke();
  rectMode(CENTER);
  
  // Blue palette
  var palette = ['#012f4b', '#6697bb', '#03396f', '#012345', '#345577', '#00a9ff', '#007199', '#0000ff' ];
  var maxSquare = 40;
  
  // Function to draw n concentric squares from a center (x, y)
  function putSquare(x, y, s, n) {
    
    for (var i = n - 1; i >= 0; --i) {
      
      fill(palette[floor(random(0, palette.length))]);
      rect(x, y, s * (i + 1), s * (i + 1));
    }
  }
  
  // Main body
  var maxLen = floor(min(width, height) / 20);
  putSquare(width / 2, height / 2, maxLen, 15);
  
  // Sub clouds
  for (var i = 0; i < maxSquare; ++i) {
  
  	putSquare(
      random((width / 2) - maxLen * 8, (width / 2) + maxLen * 8), 
      random((height / 2) - maxLen * 8, (height / 2) + maxLen * 8), 
      maxLen, 
      floor(random(1, 6))
    );
  }
  
  return [(width / 2) - maxLen * 5, (height / 2) + maxLen, maxLen * 10, maxLen];
}

register(squareBlueCloud, "Square Blue Cloud", "Juan Sebastian Robles");
