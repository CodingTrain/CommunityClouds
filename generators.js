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


function unstableCloud() {

  // Utils
  const DEBUG = false
  const debugColor = (alpha=150) => color(random(255), random(255), random(255), alpha)
  const cloudColor = (alpha=255) => color(255, alpha)
  const createCloud = (pos, d) => {
    return {pos: pos, d: d}
  }
  const drawCanvasBackground = () => {
    noStroke()
    fill(0,0,0,25)
    rect(0, 0, width, height)
  }
  const drawCloudBase = (pos, w, h) => {
    noStroke()
    DEBUG ? fill(debugColor()) : fill(cloudColor())
    rect(pos.x, pos.y, w, h)
  }
  const drawPuffyCloud = (cloud) => {
    noStroke()
    DEBUG ? fill(debugColor()) : fill(cloudColor())
    ellipse(cloud.pos.x, cloud.pos.y, cloud.d, cloud.d)
  }

  // const drawGuidLine = () =>
  const getArcCenter = (A, B, C) => {

    // Mid-points AB and BC
    const midAB = A.copy().add(B).div(2)
    const midBC = B.copy().add(C).div(2)

    // Slopes AB and BC
    const slopeAB = (B.y-A.y)/(B.x-A.x)
    const slopeBC = (C.y-B.y)/(C.x-B.x)

    // Perpendicular lines runing through mid-points AB and BC
    const slopePerpAB = -Math.pow(slopeAB, -1)
    const slopePerpBC = -Math.pow(slopeBC, -1)

    // determine b to get linear equation standard form y = mx + b
    const bAB = midAB.y - slopePerpAB * midAB.x
    const bBC = midBC.y - slopePerpBC * midBC.x

    // get intersection point
    const x = (bBC - bAB)/(slopePerpAB - slopePerpBC)
    const y = slopePerpBC * x + bBC

    if(DEBUG) {
      stroke(255)
      strokeWeight(5)
      line(midAB.x, midAB.y, x, y)
      line(midBC.x, midBC.y, x, y)
      line(B.x, B.y, C.x, C.y)
      line(B.x, B.y, A.x, A.y)
      noStroke()
      fill(0, 200)
      ellipse(A.x, A.y, 20, 20)
      ellipse(B.x, B.y, 20, 20)
      ellipse(C.x, C.y, 20, 20)
      ellipse(x, y, 20, 20)
    }

    return createVector(x, y)
  }

  // Variable factores
  const sizeFactor = 1
  const rndBaseHeight = 250 + random(50)
  const rndArcCenterHeight = -25 + random(75)
  const nPuffyClouds = Math.round(6+random(1))
  const puffyCloudsBaseSize = 300 * sizeFactor
  const puffyCloudsSizeOffset = 100 * sizeFactor

  // Cloud base
  const baseWidth = 1100 * sizeFactor
  const baseHeight = rndBaseHeight * sizeFactor
  const baseCenter = createVector(width*.5, height*.6)
  const basePos = createVector(baseCenter.x - baseWidth *.5, baseCenter.y - baseHeight *.5)

  // Puffy clouds
  let puffyClouds = []
  const puffyDiameter = baseHeight
  const puffyRadius = puffyDiameter*.5
  const puffyPos = createVector(basePos.x, basePos.y + baseHeight - puffyRadius)
  const puffyLeft = createCloud(puffyPos, puffyDiameter)
  const puffyRight = createCloud(puffyPos.copy().add(baseWidth, 0), puffyDiameter)
  puffyClouds.push(puffyLeft)
  puffyClouds.push(puffyRight)

  // Create arc from 3 points
  const A = puffyLeft.pos.copy().sub(puffyRadius*.5, 0)
  const B = baseCenter.copy().sub(0, baseHeight*.5).sub(0, rndArcCenterHeight)
  const C = puffyRight.pos.copy().add(puffyRadius*.5, 0)
  const arcCenter = getArcCenter(A, B, C)
  const arcRadius = B.dist(arcCenter)
  const arcDiameter = arcRadius * 2
  const arcOffsetAngle = atan(-(C.y - arcCenter.y) / (C.x - arcCenter.x))
  const arcTotalAngle = PI - 2*arcOffsetAngle
  const arcAngleStep = arcTotalAngle/(nPuffyClouds-1)

  for(let i = 1; i < nPuffyClouds-1; i++) {
    const x = cos(i*(arcAngleStep)+arcOffsetAngle)*arcRadius
    const y = -sin(i*(arcAngleStep)+arcOffsetAngle)*arcRadius
    const sizeOffset = map(y, -sin(arcOffsetAngle) * arcRadius, -arcRadius, 0, puffyCloudsSizeOffset, true)
    const r = puffyCloudsBaseSize + random(sizeOffset)
    puffyClouds.push(createCloud(createVector(x, y).add(arcCenter), r))
  }

  // Draw
  if(DEBUG) {
    drawCanvasBackground()
    stroke(0)
    noFill()
    arc(arcCenter.x, arcCenter.y, arcDiameter, arcDiameter, PI+arcOffsetAngle, -arcOffsetAngle)
  }
  drawCloudBase(basePos, baseWidth, baseHeight)
  puffyClouds.forEach(drawPuffyCloud)
  
  return [basePos.x, basePos.y - baseHeight*.1, baseWidth, baseHeight]
}

register(unstableCloud, "A Cloud", "@unstablectrl")