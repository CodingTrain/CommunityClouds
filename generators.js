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

function marmsCloud() {
	noStroke();
	var a = 400;
	var b = 200;
	var xc = 200;
	var yc = 100;

	var n = random(80,120);
	for(var i = 0; i < n; i++){
		var r = 2*random(30,50);
		var rx = r + random(-3,5);
		var ry = r + random(-3,5);
		var x = random(-a,a);
		var y = random(-b,b);
		while(((x-xc)/a)*((x-xc)/a) + ((y-yc)/b)*((y-yc)/b) > 1){
			var x = random(-a,a);
			var y = random(-b,b);
		}
		fill(210,210,210);
		rect(xc+x,yc+y,rx,ry,10,10);
		fill(255,255,255);
		rect(xc+x+15,yc+y-15,rx,ry,10,10);
	}
	return [30,30,2*a-60,2*b-60];
}

register(marmsCloud, "Marms Cloud", "Henrique Martinez Rocamora");

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
    let numPoints = Math.round(random(min, max));
    for (let i = 0; i < numPoints; i++) {
        // generating "peak" points of a cloud away from the center
        let angle = (TWO_PI / numPoints) * i;
        let away;
        while (true) {
            away = Math.round(random(radius) + offset);
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
      strokeWeight(random(10,14));
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

function someCloud(){
    angleMode(DEGREES);
    translate(width/2, height/2);

    let fullDeg = 360,
        sz = 2;

    noStroke();
    fill(255)
    arc(0, 0, 400 * sz, 310 * sz, 0, fullDeg)

    for(let i = 0;i <= fullDeg; i++){
        let s = 200 * sz * sin(i);
        let c = 150 * sz * cos(i);
        arc(s, c, random(100), random(100), 0, fullDeg);
    }

    return [-350, -200, width - 200, height -200];
}

register(someCloud, "Some Cloud", "Indmind");

// arbitrary cloud by Hung
function arbitraryCloud(){
  let cloud_x = 50;
  let cloud_y = 50;
  let cloud_width = width - cloud_x * 2;
	let cloud_height = height - cloud_y * 2;

	let cloud_center_size = {
		"width" : cloud_width - 300,
		"height" : cloud_height - 300
	};

	let cloud_center = {
		x: (width - cloud_center_size.width) / 2,
		y: (height - cloud_center_size.height) / 2
	};
	ellipseMode(CORNER);
	noStroke();
	// center area for drawing text
	ellipse(
		cloud_center.x,
		cloud_center.y,
		cloud_center_size.width,
		cloud_center_size.height
	);
	// generate random sub clouds

	// sub clouds infos
	let number_random_sub_clouds = 10;
	let smallest_sub_cloud_width = 200;
	let smallest_sub_cloud_height = 200;

	for(let i = 0; i < number_random_sub_clouds; i++){
		let rand_width = random(smallest_sub_cloud_width, cloud_width - 100);
		let rand_height = random(smallest_sub_cloud_height, cloud_height - 100);
		let rand_x = random(cloud_x + 10, cloud_width - rand_width);
		let rand_y = random(cloud_y + 10, cloud_height - rand_height);
		ellipse(rand_x, rand_y, rand_width, rand_height);
	}
  return [cloud_center.x, cloud_center.y, cloud_center_size.width, cloud_center_size.height];
}
register(arbitraryCloud, "Arbitrary cloud", "Hung Nguyen (fb.com/ZeroXCEH)");

function shadowCloud() {

  // A puffy cloud with a shadow by Arjen Klaverstijn info@arjenklaverstijn.com
  // https://github.com/arjhun

    angleMode(DEGREES);

    let segments = 0,
      radius = 600,
      start = random(0, 360),
      end = start + 360,
      min = 20,
      max = 40,
      puff = max * 5,
      cPoints = [];

    for (let i = start; i < end;) {

      segments = random(min, max);
      //next segment
      let nextV = i + segments;
      // lets fill up the last segment with a reasonable one
      if (end - nextV < max - (max - min / 2)) nextV = end;
      //create coordinates for bezier segments
      cPoints.push(
        [radius * sin(i),
        radius / 3 * cos(i),
        (radius + puff) * sin(i),
        (radius / 3 + puff) * cos(i),
        (radius + puff) * sin(nextV),
        (radius / 3 + puff) * cos(nextV),
        radius * sin(nextV),
        radius / 3 * cos(nextV)
      ]);
      i += segments
      //if next vertex is at the end stop drawing
      if (nextV == end) break;
    }

    function drawCloud(offSet) {
      push();
        translate(width / 2+offSet, height / 2+offSet);
        beginShape();
        for (let c = 0; c < cPoints.length; c++) {
          vertex(cPoints[c][0] , cPoints[c][1] );
          bezierVertex(cPoints[c][2] , cPoints[c][3] , cPoints[c][4] , cPoints[c][5] , cPoints[c][6] , cPoints[c][7] );
        }
        endShape();
      pop();
    }

  //draw the actuall clouds

  fill(0); // random shadow
  drawCloud(random(20,100));

  fill(255);
  drawCloud(0);

  return [width/2-radius, height/2 -(radius/3), radius*2, (radius/3)*2];
}

register(shadowCloud, "Cloud with Shadow", "Arjen Klaverstijn (@aklaverstijn)");

function CircularCloud() {
  // Draw big cloud parts
  fill(255, 255, 255, 90);
  for(let i = 0; i < 500; i++){
    fill(255, 255, 255, 50);
    //the bigger i; the more centered are the circles and the less likely they are outlined
    let offsetVec = p5.Vector.random2D();
    let scaleX = random(-600, 600) / (i * 0.001+1);
    let scaleY = random(-300, 300) / (i * 0.001+1);
    offsetVec.x *= scaleX;
    offsetVec.y *= scaleY;
    let outside = offsetVec.mag();
    if(random(700) < outside && random() > 0.7){
      strokeWeight(1);
      //fill(200, 0, 0);
    }

    else strokeWeight(0);
    ellipse(width/2 + offsetVec.x, height/2 + offsetVec.y,  random(50, width/4));
  }

  // Draw small cloud parts
  fill(255, 255, 255, 90);
  for(let i = 0; i < 500; i++){
    fill(255, 255, 255, 50);
    let offsetVec = p5.Vector.random2D();
    let scaleX = random(-500, 500) / (i * 0.001+1);
    let scaleY = random(-250, 250) / (i * 0.001+1);
    offsetVec.x *= scaleX;
    offsetVec.y *= scaleY;
    let outside = offsetVec.mag();
    if(random(3000) < outside && random() > 0.7){
      strokeWeight(1);
      //fill(200, 0, 0);
    }
    else strokeWeight(0);
    ellipse(width/2 + offsetVec.x, height/2 + offsetVec.y,  random(10, width/8));
  }


  return [100, 100, width - 200, height - 200];
}

register(CircularCloud, "CircularCloud", "lokmeinmatz / Matthias");

function cumulus() {
  let cloud = [];
  const x = width / 2,
        y = height / 1.8,
        humps = round(random(3, 7)),
        diameter = width / humps,
        spacing = diameter / 2,
        mainHumpPos = 0.5, // 0 = left > 1 = right
        piRatio = HALF_PI / (humps / (1 / mainHumpPos));

  for (let i in [...Array(humps)]) {
    // Start with smaller "puffs", larger in the middle, end with small again
    let sine = 1 + sin(piRatio * i),
        variance = random(1, 0.7 / mainHumpPos) * sine,
        radius = spacing * variance,
        newX = width/2 - x / 2 + spacing / 2 + spacing * i; // Seriously? That much effort to move half to the left then continue spacing to the right?
    cloud.push([newX, y, radius]); // save the cloud so we can double draw, idk how else to do it
  }

  // draw black cloud with stroke
  cloud.forEach(puff => {
    strokeWeight(10);
    arc(puff[0], puff[1], puff[2], puff[2], PI, TAU, PIE);
  });

  // draw white cloud without stroke
  cloud.forEach(puff => {
    fill(255);
    strokeWeight(0);
    arc(puff[0], puff[1], puff[2], puff[2], PI, TAU, PIE);
  });

  return [x / 2, 0, x, height];
}
register(cumulus, "Cumulus", "Luke Flego");

function arcClouds() {
	// draws arc
	function drawArc(c1, c2, c3) {
		// first and second circle intersection points
		let fs_int_points = circleIntersetc(c1.x, c1.y, c1.r,
			c2.x, c2.y, c2.r);
		// second and third circle intersection points
		let st_int_points = circleIntersetc(c2.x, c2.y, c2.r,
			c3.x, c3.y, c3.r);
		//
		let p0_x = fs_int_points[0];
		let p0_y = fs_int_points[1];
		let p1_x = st_int_points[0];
		let p1_y = st_int_points[1];
		//
		let v = createVector(1, 0);
		let v1 = createVector(p0_x - c2.x, p0_y - c2.y);
		let v2 = createVector(p1_x - c2.x, p1_y - c2.y);
		let startAngle = -angle(v1, v);
		let endAngle = -angle(v2, v);
		strokeWeight(3);
		stroke(0);
		arc(c2.x, c2.y, c2.r * 2, c2.r * 2, startAngle, endAngle);
	}
	// computes angle between 2 vectors, returns value between [0, 2*PI]
	function angle(v1, v2) {
		return Math.atan2(v1.x * v2.y - v1.y * v2.x, v1.x * v2.x + v1.y * v2.y);
	}
	// computes the intersection points between 2 circles
	function circleIntersetc(x0, y0, r0, x1, y1, r1) {
		//
		let d = dist(x0, y0, x1, y1);
		// distance between P0 and P2
		let a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
		let h = sqrt(r0 * r0 - a * a);
		//
		let x2 = x0 + a * (x1 - x0) / d;
		let y2 = y0 + a * (y1 - y0) / d;
		//
		let intp1_x = x2 + h * (y1 - y0) / d;
		let intp2_x = x2 - h * (y1 - y0) / d;
		let intp1_y = y2 - h * (x1 - x0) / d;
		let intp2_y = y2 + h * (x1 - x0) / d;
		//
		return [intp1_x, intp1_y, intp2_x, intp2_y];
	}
	noFill();
	translate(width / 2, height / 2);
	let r1 = 400;
	let r2 = 200;
	let increment = 0.5;
	let firstCircle, secondCircle, thirdCircle;
	let circles = [];
	// create circles
	for(let angle = 0;angle < 2 * PI;angle+=increment) {
		let x = r1 * cos(angle);
		let y = r2 * sin(angle);
		let rr = random(100, 150);
		circles.push({
			x : x,
			y : y,
			r : rr
		});
	}
	// draw arcs
	for(let j = 0;j < circles.length - 2;j++) {
		firstCircle = circles[j];
		secondCircle = circles[j + 1];
		thirdCircle = circles[j + 2];
		if(firstCircle && secondCircle && thirdCircle) {
			drawArc(firstCircle, secondCircle, thirdCircle);
		}
	}
	//
	firstCircle = circles[circles.length - 2];
	secondCircle = circles[circles.length - 1];
	thirdCircle = circles[0];
	drawArc(firstCircle, secondCircle, thirdCircle);
	//
	firstCircle = circles[circles.length - 1];
	secondCircle = circles[0];
	thirdCircle = circles[1];
	drawArc(firstCircle, secondCircle, thirdCircle);
	//
	return [-r1, -r2, 2 * r1, 2* r2];
}

register(arcClouds, "Arc Cloud", "edwin.straub");

// created by georges Daou 29-sep-2017
function randomSimpleCloud() {


  let minWidthSub = (5 * width) / 100;
  let maxWidthSub = (30 * width) / 100;

  let minHeightSub = (70 * height) / 100;
  let maxHeightSub = (85 * height) / 100;


  let cloudWidth = width - floor(random(minWidthSub, maxWidthSub)) - 100;
  let cloudHeight = height - floor(random(minHeightSub, maxHeightSub) - 100);

  push();
  translate(width / 2, height / 2);

  noStroke();
  fill(255);

  //base papa cloud
  ellipse(0, 0, cloudWidth, cloudHeight);

  angleMode(DEGREES);

  for (let angle = 0; angle < 360; angle += random(20, 30)) { //generating little cloudinette :)

    //choose right coordinates for the cloudinette not too close to the edge

    let x = ((cloudWidth / 2) * cos(angle));

    if (abs(x) > cloudWidth / 2 - cloudWidth / 6)
      continue;

    let y = (cloudHeight / 2) * sin(angle);

    //pushing the cloudinette a bit to the center for more realistic look
    if (y >= 0)
      y = random(y - 20, y);
    else
      y = random(y, y + 20);

    // finally choose width and height in relation of the papa cloud size
    ellipse(x, y, random(cloudWidth / 4, cloudWidth / 4 + 15), random(cloudHeight / 2, cloudHeight / 2 + 15));
  }

  pop();
  return [100, 100, width - 200, height - 200];
}
register(randomSimpleCloud, "Simple Random Cloud", "Georges Daou");

// Puffy Cloud
function puffyCloud(){
  const puffRadius = width/6;
  const mainRadius = width/2.5;
  let x, y;
  let stack = [];
  push();
    translate(width / 2, height / 2);
    angleMode(DEGREES)
    noStroke();
    fill(255, 255, 255);
    ellipse(0, 0, mainRadius*2, mainRadius);
    fill(0, 0, 0);
    for(let i = 0; i <=360;) {
        x = mainRadius * cos(i);
        y = 0.5 * mainRadius * sin(i);
        r = puffRadius * random(0.9, 1.5) * ((y+width) / width);
        ellipse(x, y, r, r);
        i += random(15, 25);
        stack.push({x: x, y: y, r: r});
    }
    fill(255, 255, 255);
    stack.forEach(function (puff) {
        let x = puff.x * .97;
        let y = puff.y * .97;
        let r = puff.r * .985;
        ellipse(x, y, r, r);
    });
  pop();
  return [100, 100, width - 200, height - 200];
}

register(puffyCloud, "Puffy Cloud", "Cary Stanley (@carystanley)")

function bubblyCloud() {
  let RANGE = 30;
  let SMALLEST = 0.1;
  let SHADOW_A = Math.PI / 8 * 3;
  let SHADOW_I = 1.1;
  let SIDE = (height < width ? height : width)

  for(var i = 0; i <= RANGE; i++) {
    let dist = i * (1 - SMALLEST) * 2 / RANGE - 1 - SMALLEST;
    let diameter = SIDE * (1 - dist * dist) * 0.7;
    let shadow = i / RANGE * 255

    push();

    translate(width / 2 - diameter / 2 + random(diameter), height / 2 - diameter / 2 + random(diameter));

    fill(shadow / 10 + 228);
    noStroke();
    smooth();

    ellipse(0, 0, diameter - 1, diameter - 1);

    var start_a = SHADOW_A + 0.005 - Math.PI / 2;
    var stop_a = SHADOW_A - 0.005 + Math.PI / 2;

    fill(shadow / 10 + 200);
    arc(0, 0, diameter, diameter, start_a, stop_a, CHORD);

    let m_d = diameter * SHADOW_I;
    let ad = asin(diameter / m_d);

    start_a = SHADOW_A - ad;
    stop_a = SHADOW_A + ad;

    let r_d = sqrt(m_d * m_d - diameter * diameter) / 2
    let offset_x = -r_d * cos(SHADOW_A);
    let offset_y = -r_d * sin(SHADOW_A);

    fill(shadow / 10 + 228);
    arc(offset_x, offset_y, m_d, m_d, start_a, stop_a, CHORD);

    pop();
  }
  return [(width - SIDE) / 2, (height - SIDE) / 2, SIDE, SIDE, 80];
}
register(bubblyCloud, "Bubbly Cloud", "G4m3M4ni4c");

function mcCloud() {
    noStroke();

    const w = width - width / 3;
    const h = w / 4;
    const dmin = w / 4;
    const dmax = w / 2;
    const offset = createVector((width - w) / 2, (height - h) / 2);
    const gray = 240;

    const getPosition = (i) => {
        if (i < w) return createVector(i, 0);
        if (i < w + h) return createVector(w, i - w);
        if (i < w * 2 + h) return createVector(i - (w + h), h);
        if (i < (w + h) * 2) return createVector(0, i - (w * 2 + h));
        return null;
    };

    let i = random(dmax - dmin);
    let pos;
    while (pos = getPosition(i)) {
        pos.add(offset);
        var d = random(dmin, dmax);
        for (let j = 0; j <= 20; j+=5) {
          fill(gray, gray, gray, map(j, 0, 20, 100, 0));
          ellipse(pos.x, pos.y + 50 + j, d);
        }
        fill(255, 255, 255);
        ellipse(pos.x, pos.y, d);
        i += d / 2;
    }

    rect(offset.x, offset.y, w, h);

    return [offset.x, offset.y, w, h];
}
register(mcCloud, "Mc Cloud", "Rodolphe Peccatte");

function drawBumpyCloud()
{
	push();
	strokeWeight(5);
	translate(width / 2, height / 2);
	angleMode(DEGREES);
	let cloudWidth = width / 2;
	let cloudHeight = height / 2;
	let vertices = [];

	for (let i = random(5, 15); i < 360; i += random(20, 15))
	{
		vertices.push(
		{
			x: cos(i) * (cloudWidth / 2),
			y: sin(i) * (cloudHeight / 2)
		});
	}
	vertices.push(vertices[0]);
	stroke(0);
	fill(255);
	for (let i = 0; i < vertices.length - 1; i++)
	{
		let p1 = vertices[i];
		let p2 = vertices[i + 1];
		let dx = p2.x - p1.x;
		let dy = p2.y - p1.y;
		let dst = sqrt(dx * dx + dy * dy);
		ellipse((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, dst, dst);
	}
	noStroke();
	fill(255);
	ellipse(0, 0, cloudWidth, cloudHeight);
	pop();
	cloudWidth = cloudWidth * 4 / 5;
	cloudHeight = cloudHeight * 4 / 5;

	return [(width - cloudWidth) / 2, (height - cloudHeight) / 2, cloudWidth, cloudHeight];
}

register(drawBumpyCloud, "Bumpy Cloud", "Fir3will");

function fluffyTriangle(){
	const cw = width - (width / 5); // Cloud width
	const side = round(random(1)); // What side the inside triangle goes to
	const bottomY = (height/3)*2;
	const topY = height/3;
	const topX = (width/5) + (side*(cw/3)) + (noise(100)*(cw/3));
	const bs = cw/15;
	// Noise used here to get random values close to the middle of the used values
  fill(255);

  // bottom
	for(let x=width/5+random(bs); x<cw-random(bs); x+=random(bs/2+bs/4,bs-(bs/4))){
		let av=bs/4;
		ellipse(x,bottomY,bs+av,bs+av);
	}

	// left
	var av;
	let ld = dist(width/5,bottomY,topX,topY);
	for(let i=0; i<ld; i+=random(bs/2+bs/4,bs-(bs/10))){
		let x=map(i,0,ld,(width/5),topX);
		let y=map(i,0,ld,bottomY,topY);
		av=sin(map(i,0,ld,0,HALF_PI))*bs+(random(bs/3)*random(1));
		ellipse(x,y,bs+av,bs+av);
	}
	//ellipse(topX,topY,bs+av+10,bs+av+10);

	//right
	  ld = dist(cw,bottomY,topX,topY);
	for(let i=0; i<ld; i+=random(bs/2+bs/4,bs-(bs/10))){
		let x=map(i,0,ld,(cw),topX);
		let y=map(i,0,ld,bottomY,topY);
		av=sin(map(i,0,ld,0,HALF_PI))*bs+(random(bs/3)*random(1));
	  ellipse(x,y,bs+av,bs+av);
	}

	// Triangle to prevent full circle stroke
	noStroke();
	beginShape();
   vertex(topX,topY-bs/6);
   vertex(width/5-bs/6,bottomY+bs/6);
   vertex(cw+bs/6,bottomY+bs/6);
  endShape(CLOSE);

return [100, 100, width - 200, height - 200];
}

register(fluffyTriangle,"Fluffy triangle","WIPocket");

function bitStoneRectCloud() {
    // ++++++++++++++++++++++++ Settings +++++++++++++++++++++++++++++++++++++
    // Margin to the outer space where the name could be placed
    const BS_DRAW_RECT_OFFSET = 120;

    // Margin to the outer space where the clouds start.
    const BS_CLOUD_OFFSET = 30; // needs to be smaller than BS_DRAW_RECT_OFFSET!

    // Maximum and minimum size of the cloud parts
    const BS_CLOUD_MAX_SIZE = 80;
    const BS_CLOUD_MIN_SIZE = 25;

    // +++++++++++++++++++++++ Code ++++++++++++++++++++++++++++++++++++++++++
    // Code starts here.
    const BS_DRAW_RECT_DOUBLE_OFFSET = BS_DRAW_RECT_OFFSET * 2.0;
    const BS_DRAW_RECT_WIDTH = width - BS_DRAW_RECT_DOUBLE_OFFSET;
    const BS_DRAW_RECT_HEIGHT = height - BS_DRAW_RECT_DOUBLE_OFFSET;

    const BS_CLOUD_WIDTH = width - BS_CLOUD_OFFSET * 2.0;
    const BS_CLOUD_HEIGHT = height - BS_CLOUD_OFFSET * 2.0;

    const BS_CLOUD_RANDOM_VALUE = BS_CLOUD_MAX_SIZE - BS_CLOUD_MIN_SIZE;

    // possible rect types
    const BS_RECT_LEFT = 0;
    const BS_RECT_TOP_LEFT = 1;
    const BS_RECT_BOTTOM_LEFT = 2;
    const BS_RECT_TOP = 3;
    const BS_RECT_BOTTOM = 4;
    const BS_RECT_BOTTOM_RIGHT = 5;
    const BS_RECT_RIGHT = 6;
    const BS_RECT_TOP_RIGHT = 7;


    let topRectList = [];
    let bottomRectList = [];
    let leftRectList = [];
    let rightRectList = [];

    // +++++++++ generate TOP
    let currentX = 0;
    let currentY = 0;
    let nextY = 0;
    let type = 0;
    let size;

    while(currentX < BS_CLOUD_WIDTH - (BS_CLOUD_MAX_SIZE)) {
        size = Math.round(random() * BS_CLOUD_RANDOM_VALUE) + BS_CLOUD_MIN_SIZE;
        nextY += Math.round(random() * size / 2.0 - (size / 4.0));

        if(currentX < BS_CLOUD_WIDTH / 2.0) {
            type = (nextY <= currentY ? BS_RECT_TOP_LEFT : BS_RECT_TOP);
        } else {
            if(topRectList.length <= 0) {type = BS_RECT_TOP;}
            else {
                let item = topRectList[topRectList.length - 1];
                type = (item.y > currentY ? BS_RECT_TOP : BS_RECT_TOP_RIGHT);
            }
        }

        topRectList.push({
            x: currentX,
            y: currentY,
            size: size,
            type: type
        });

        currentY = nextY;
        currentX += size;
    }

    // ++++++++++ generate last TOP ELEMENT
    topRectList.push({
        x: currentX,
        y: currentY,
        size: BS_CLOUD_WIDTH - currentX,
        type: BS_RECT_TOP
    });

    // ++++++++++ generate BOTTOM
    currentX = 0;
    currentY = BS_CLOUD_HEIGHT;
    nextY = currentY;
    type = 0;

    while(currentX < BS_CLOUD_WIDTH - BS_CLOUD_MAX_SIZE) {
        size = Math.round(random() * BS_CLOUD_RANDOM_VALUE) + BS_CLOUD_MIN_SIZE;
        nextY += Math.round(random() * size / 2.0 - (size / 4.0));

        if(currentX < BS_CLOUD_WIDTH / 2.0) {
            type = (nextY <= currentY ? BS_RECT_BOTTOM : BS_RECT_BOTTOM_LEFT);
        } else {
            if(bottomRectList.length <= 0) {type = BS_RECT_BOTTOM;}
            else {
                let item = bottomRectList[bottomRectList.length - 1];
                type = (item.y <= currentY ? BS_RECT_BOTTOM : BS_RECT_BOTTOM_RIGHT);
            }
        }

        bottomRectList.push({
            x: currentX,
            y: currentY,
            size: size,
            type: type
        });

        currentY = nextY;
        currentX += size;
    }

    // ++++++++++ generate last BOTTOM ELEMENT
    bottomRectList.push({
        x: currentX,
        y: currentY,
        size: BS_CLOUD_WIDTH - currentX,
        type: BS_RECT_BOTTOM
    });

    // +++++++++++ generate LEFT
    currentX = 0;
    currentY = topRectList[0].y + topRectList[0].size;

    while(currentY < (bottomRectList[0].y - bottomRectList[0].size - BS_CLOUD_MAX_SIZE)) {
        size = Math.round(random() * BS_CLOUD_RANDOM_VALUE) + BS_CLOUD_MIN_SIZE;

        type = BS_RECT_LEFT;

        leftRectList.push({
            x: currentX - size,
            y: currentY,
            size: size,
            type: type
        });

        currentY += size;
    }

    // +++++++++++ generate last LEFT ELEMENT
    size = (bottomRectList[0].y - bottomRectList[0].size) - currentY;
    leftRectList.push({
        x: currentX - size,
        y: currentY,
        size: size,
        type: BS_RECT_LEFT
    });

    // +++++++++++ generate RIGHT
    currentX = topRectList[topRectList.length - 1].x + topRectList[topRectList.length - 1].size;
    currentY = topRectList[topRectList.length - 1].y + topRectList[topRectList.length - 1].size;

    while(currentY < (bottomRectList[bottomRectList.length - 1].y - BS_CLOUD_MAX_SIZE)) {
        size = Math.round(random() * BS_CLOUD_RANDOM_VALUE) + BS_CLOUD_MIN_SIZE;
        type = BS_RECT_RIGHT;

        rightRectList.push({
            x: currentX,
            y: currentY,
            size: size,
            type: type
        });

        currentY += size;
    }

    // +++++++++++ generate last RIGHT ELEMENT
    size = Math.abs((bottomRectList[bottomRectList.length - 1].y) - currentY);
    rightRectList.push({
        x: currentX,
        y: currentY,
        size: size,
        type: BS_RECT_RIGHT
    });


    // draw rects
    beginShape();
    for(let i in topRectList) {
        let item = topRectList[i];
        bs_drawRect(item.x, item.y, item.size, item.type);
    }
    for(let i in rightRectList) {
        let item = rightRectList[i];
        bs_drawRect(item.x, item.y, item.size, item.type);
    }
    for(let i = bottomRectList.length - 1; i >= 0; i--) {
        let item = bottomRectList[i];
        bs_drawRect(item.x, item.y, item.size, item.type);
    }
    for(let i = leftRectList.length - 1; i >= 0; i--) {
        let item = leftRectList[i];
        bs_drawRect(item.x, item.y, item.size, item.type);
    }
    endShape();
    fill(255);

    function bs_drawRect(posX, posY, size, type) {
        switch(type) {
            case BS_RECT_LEFT:
                vertex(posX + size, posY + size);
                vertex(posX, posY + size);
                vertex(posX, posY);
                vertex(posX + size, posY);
            break;
            case BS_RECT_TOP_LEFT:
                vertex(posX, posY + size);
                vertex(posX, posY);
                vertex(posX + size, posY);
            break;
            case BS_RECT_BOTTOM_LEFT:
                vertex(posX + size, posY + size);
                vertex(posX, posY + size);
                vertex(posX, posY);
            break;
            case BS_RECT_TOP:
                vertex(posX, posY + size);
                vertex(posX, posY);
                vertex(posX + size, posY);
                vertex(posX + size, posY + size);
            break;
            case BS_RECT_BOTTOM:
                vertex(posX + size, posY);
                vertex(posX + size, posY + size);
                vertex(posX, posY + size);
                vertex(posX, posY);
            break;
            case BS_RECT_BOTTOM_RIGHT:
                vertex(posX + size, posY);
                vertex(posX + size, posY + size);
                vertex(posX, posY + size);
            break;
            case BS_RECT_RIGHT:
                vertex(posX, posY);
                vertex(posX + size, posY);
                vertex(posX + size, posY + size);
                vertex(posX, posY + size);
            break;
            case BS_RECT_TOP_RIGHT:
                vertex(posX, posY);
                vertex(posX + size, posY);
                vertex(posX + size, posY + size);
            break;
            default: break;
        }
    }

    return [BS_DRAW_RECT_OFFSET, BS_DRAW_RECT_OFFSET, BS_DRAW_RECT_WIDTH, BS_DRAW_RECT_HEIGHT];
}

register(bitStoneRectCloud, "bit-stone rect cloud", "Kuno Zoltner (github: kzoltner)");

function curveVertexCloud() {
  let radius = width/5;
  let points = floor(random(5)) + 10;
  let cloud = [];

  for (let angle = 0; angle < TWO_PI-0.1; angle += TWO_PI/points) {
    let x = 2 * radius * cos(angle) + random(-20, 20);
    let y = radius * sin(angle) + random(-20, 20);

    cloud.push(createVector(x,y));
  }

  cloud.push(cloud[0]);

  push();
  translate(width/2, height/2);

  noFill();
  stroke(255);
  strokeWeight(2);

  for (let i = 0; i < cloud.length-1; i++) {
    beginShape();
    curveVertex(0, 0);
    curveVertex(cloud[i].x, cloud[i].y);
    curveVertex(cloud[i+1].x, cloud[i+1].y);
    curveVertex(0, 0);
    endShape();
  }

  pop();

  return [width/2-radius*1.4, height/2-radius/2, width/2+radius*1.4, height/2+radius/2];
}

register(curveVertexCloud, "curveVertex() Cloud", "xperion");

function noCloud() {
  var bg, p, p1, p2, p3, p4, p5, center;
  function drawCloud(points) {
    stroke(bg);
    beginShape();
    for (var i = 0; i < points.length; i++) {
      vertex(points[i].x, points[i].y);
    }
    endShape(CLOSE);

    stroke(0);
    p = points[0];
    for (var i = 1; i < points.length; i++) {
      drawCloudArc(p, points[i]);
      p = points[i];
    }

    line(points[0].x, points[0].y, points[points.length-1].x, points[points.length-1].y);
  }

  function drawCloudArc(begin, end) {
    function f(p,d) {
      return p[d] - ((center[d] - p[d])/2);
    }
    center = {"x": width/2, "y": height/2};
    bezier(begin.x, begin.y, f(begin, "x"), f(begin,"y")-200, f(end, "x"), f(end, "y")-200, end.x, end.y);
  }

  function randomOffset(n) {
    return random(n*2)-n;
  }

  p1 = {"x":200, "y":height-300};
  p2 = {"x":(width/4)+randomOffset(100), "y":240+randomOffset(50)};
  p3 = {"x":width*2/4+randomOffset(100), "y":150+randomOffset(50)};
  p4 = {"x":150+(width*3/4)+randomOffset(100), "y":270+randomOffset(50)};
  p5 = {"x":width-200, "y":height-300};

  bg = 150;
  fill(bg);
  drawCloud([p1,p2,p3,p4,p5].map(function(e){return {"x":e.x+100,"y":e.y}}));
  bg = 255;
  fill(bg);
  drawCloud([p1,p2,p3,p4,p5]);

  return [100, 100, width - 200, height - 200];
}
register(noCloud, "There is no cloud", "rnoennig");

/**
 * To draw a square cloud composed of other squares
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

  return [width / 2, height / 2, maxLen * 15, maxLen * 15, "77F"];
}

register(squareBlueCloud, "Square Blue Cloud", "Juan Sebastian Robles");

function CloudyCloud()
{
	//I'm really sorry about this one xD
	translate(width/2,height/2);
	noStroke();
	for(let i = 0; i < 30; i++)
		ellipse(random(-130,130),random(-15,25),random(50,200));

  return [-130,-50,130*2,50*2];
}
register(CloudyCloud, "Radnomly Generated Cloud", "this.Zohir")

function CloudyMcCloudson(){
  for(var i = 0; i<15;i++){
    noStroke();
    ellipse(random(600,1400),random(200,450),random(300,400),random(300,400));
  }
  return [700, 200, 400,400];
}
register(CloudyMcCloudson, "Cloudy McCloudson", "Marius Bauer");

function MaxTaylorCloud() {
    let clouds = []
    // Play with these to get the desired effect
    const showBorder = true
    const showTransparency = false;
    const puffyNess = 40
    const radius = 150

    for (let i = 0; i < puffyNess; i++) {
        let x = width/2 + random(-200, 200)
        let y = height/2 + random(-100, 100)
        clouds.push({ x, y })

        if (!showBorder) { continue; }

        noFill()
        strokeWeight(5)
        stroke(0)
        ellipse(x, y, radius, radius)
    }

    for (let cloud of clouds) {
        noStroke()
        fill(255, 255, 255, (!showBorder && showTransparency) ? random(170, 255) : 255);
        ellipse(cloud.x, cloud.y, radius, radius)
    }

    return [width/2 - 150, height/2 - 50, 300, 100]
}

register(MaxTaylorCloud, "Cloudy McCloudFace", "Max Taylor");

// Koch snowflake-shaped cloud
function kochSnowCloud() {
  stroke(0);
  strokeWeight(2);
  fill(255);

  let flake_size = width / 5;

  let pos = createVector((width - flake_size) / 2, 3 * height / 4);
  let angle = 0;
  let yscale = height / width;

  function move(r) {
    pos.add(createVector(r * Math.cos(angle), r * Math.sin(angle) * yscale));
  }

  beginShape();
  for (let i = 0; i < 13; i++) {
    koch(flake_size);
    angle -= 2 * PI / 13;
  }
  endShape(CLOSE);

  function koch(r) {
    if (r > 5) {
      koch(r / 3);
      angle += PI / 3;
      koch(r / 3);
      angle -= 2 * PI / 3;
      koch(r / 3);
      angle += PI / 3
      koch(r / 3);
    } else {
      vertex(pos.x, pos.y);
      move(r);
    }
  }

  return [(width - 3.5 * flake_size) / 2, height / 6, flake_size * 3.5, height / 3];
}

register(kochSnowCloud, "Koch Snow-Cloud", "Kristian Wichmann");

function AbdulCloud(){
  const canvas = document.querySelector('#defaultCanvas0');
  noStroke();
  c = {h:parseInt(canvas.style.height.replace('px',''))/2, w:parseInt(canvas.style.width.replace('px',''))/2};
  const numberOfElip = random(1,500)
  for(var i = 0; i<numberOfElip;i++){
    noStroke();
    ellipse(random(600,1400),random(200,450),random(300,400),random(300,400));
  }
  return [700, 200, 400,400];
}

register(AbdulCloud, "SillyBlob", "Abdul Shaikh");

function dryCloud(){

  var cloudWidth = width * 9/10;

  var startPoint = createVector((width - cloudWidth)/2, height * 3/5);
  var endPoint = createVector((width + cloudWidth)/2, height * 3/5);

  var points = [];

  points.push(startPoint);
  stroke(255);
  line(startPoint.x,startPoint.y,endPoint.x,endPoint.y);

  for (var i = 1; i < 100; i++) {
    points.push(createVector(random(points[i-1].x + 10, points[i-1].x + 20), random(points[i-1].y - 60,endPoint.y)));
    var radius = dist(points[i].x,points[i].y,points[i-1].x,points[i-1].y);
    var from = points[i-1].copy().sub(points[i]).heading();
    var to = endPoint.copy().sub(points[i]).heading();
    if (to < from) {
      to += TWO_PI;
    }
    fill(255);
    if (points[i-1].x + radius*2 < endPoint.x) {

      arc(points[i].x, points[i].y, radius*2, radius*2, from, to, PIE);
    } else {
      from = startPoint.copy().sub(points[i]).heading();
      if (to < from) {
        to += TWO_PI;
      }
      radius = dist(endPoint.x, endPoint.y, points[points.length - 1].x, points[points.length - 1].y);
      arc(points[i].x, points[i].y, radius*2, radius*2, from, to, PIE);
      ellipse(points[i].x, points[i].y,2*(startPoint.y - points[i].y), 2*(startPoint.y - points[i].y));
      break;
    }
  }
  points.push(endPoint);
  beginShape();
  for(var i = 0; i < points.length; i++) {
    vertex(points[i].x, points[i].y);
  }
  endShape(CLOSE);
}

register(dryCloud, "Dry Cloud", "DryCreations");

function roundCloud() {
  fill(255);
  noStroke();

  // The real bit

  // How many points?
  var num = 256;
  var xoff = 0;

  var r = 200;
  var rZero = r + 50 * noise(0);

  beginShape(); // Draw the shape
  for (var i = 0; i < num; i++) {

    var a = map(i, 0, num, 0, TWO_PI);

    // Perlin Noise
    var n = r + 50 * noise(xoff);

    // Making it a loop (so you don't
    // see any cut on the right)
    if (i == 0) {
      rZero = n;
    } else if (i > num*0.95) {
      var percent = map(i, num*0.95, num, 0, 1);
      n = lerp(n, rZero, percent);
    }

    // Polar to Cartesian
    // coordinate transformation
    var x = width/2 + n * cos(a);
    var y = height/2 + n * sin(a);

    vertex(x, y);

    xoff += 0.1;

  }
  endShape(CLOSE);
}

register(roundCloud, "Round Cloud", "Simon Tiger");

function lightning_cloud(x=0, y=0){
	noStroke();
	for (let i = 0; i < 100; i++){
		const r = random(100);
		ellipse(x + random(-100, 100), y + random(50, 150), r, r);
	}


	const lightning = function(x, y, strokeweight, length, depth = 1){
		if (length < 1) return;
		const nextDepth = [];
		const intensity = sqrt(depth) * 10;
		push();
		noiseSeed(random(100));
		stroke(255, 255, 255);
		strokeWeight(strokeweight);

		let xCurr, yCurr;
		let xPrev = x, yPrev = y;
		for (let offset = 0; offset < length; offset+=10){
			xCurr = xPrev + map(noise(offset * 0.1), 0, 1, -1, 1) * intensity;
			yCurr = y + offset
			line(xPrev, yPrev, xCurr , yCurr);
			xPrev = xCurr;
			yPrev = yCurr;
			nextDepth.push([xCurr, yCurr]);
		}

		pop();

		nextDepth.forEach((e) => {
			for (let i = 0; i < random(-100, 4); i++)
				lightning(e[0], e[1], strokeweight * 0.5, length * 0.4, depth + 1);
		})

	}

	lightning(x , y + 100 , 5, 500);
}

register(lightning_cloud, "Lightning Cloud", "Eitan Porat")

function trainCloud()
{
  // Draw train.
  push();

  // Position, scale, stroke weight.
  translate(width - 420, height - 100);
  scale(2, 2);
  strokeWeight(3);

  // Front.
  beginShape();
  vertex(60, 40);
  vertex(110, 40);
  vertex(115, 55);
  vertex(110, 70);
  vertex(60, 70);
  endShape(CLOSE);
  strokeWeight(2);
  line(90, 50, 90, 60);
  line(95, 50, 95, 60);
  line(100, 50, 100, 60);
  strokeWeight(3);

  // Back.
  beginShape();
  vertex(0, 10);
  vertex(70, 8);
  vertex(65, 70);
  vertex(10, 50);
  endShape(CLOSE);

  // Top.
  beginShape(QUADS);
  vertex(85, 40);
  vertex(80, 10);
  vertex(110, 10);
  vertex(105, 40);
  vertex(75, 10);
  vertex(70, 0);
  vertex(120, 0);
  vertex(115, 10);
  endShape(CLOSE);

  // Bottom.
  beginShape(QUADS);
  vertex(60, 70);
  vertex(110, 70);
  vertex(110, 85);
  vertex(50, 85);
  vertex(95, 70);
  vertex(110, 70);
  vertex(125, 90);
  vertex(100, 90);
  endShape();

  // Outer wheels.
  ellipse(35, 70, 60);
  ellipse(80, 89, 20);

  // Inner wheels.
  fill(0);
  ellipse(35, 70, 10);
  ellipse(80, 89, 5);
  noFill();
  pop();

  // Cloud drawing function.
  function drawCloud(cloudRadius, stepAngle, rotationOffset) {
    noStroke();
    ellipse(0, 0, cloudRadius * 4, cloudRadius * 2);
    stroke(0);
    for (let angle = rotationOffset; angle < rotationOffset + 360; angle += stepAngle)
    {
      const x = cloudRadius * 2 * cos(angle);
      const y = cloudRadius * sin(angle);
      const radius = cloudRadius + random(cloudRadius * 0.2);
      const rotation = atan2(-x, 2 * y) - 90;
      const gapAngle = 360 - random(70, 90);
      const startAngle = -gapAngle + rotation;
      const endAngle = gapAngle + rotation;

      noStroke();
      ellipse(x, y, radius * 2, radius * 2);
      stroke(0);
      arc(x, y, radius * 2, radius * 2, startAngle, endAngle);
    }
  }

  // Draw big cloud.
  push();
  angleMode(DEGREES);
  translate(width / 2 - 80, height / 2 - 80);
  scale(2, 2);
  strokeWeight(3);

  const radius = 70;
  drawCloud(radius, Math.floor(360 / random(6, 8)), random(360));
  pop();

  // Draw small cloud.
  push();
  translate(width - 290, height - 190);
  strokeWeight(3);
  drawCloud(radius / 4, Math.floor(360 / random(6, 8)), random(360));
  pop();

  // Return safe drawing area.
  return [width / 2 - 80 - radius * 4, height / 2 - 80 - radius * 2, radius * 8, radius * 4];
}
register(trainCloud, "Train Cloud", "Nils Weber");

function p5Cloud() {

  // words that are used to make cloud stroke
  var words = [ "alpha", "blue", "brightness", "color", "green", "hue",
    "lerpColor", "lightness", "red", "saturation", "background", "clear",
    "colorMode", "fill", "noFill", "noStroke", "stroke", "arc",
    "ellipse", "line", "point", "quad", "rect", "triangle",
    "ellipseMode", "noSmooth", "rectMode", "smooth", "strokeCap", "strokeJoin",
    "strokeWeight", "bezier", "bezierPoint", "bezierTangent", "curve", "curveTightness",
    "curvePoint", "curveTangent", "beginContour", "beginShape", "bezierVertex", "curveVertex",
    "endContour", "endShape", "quadraticVertex", "vertex", "loadModel", "model",
    "plane", "box", "sphere", "cylinder", "cone", "ellipsoid",
    "torus", "HALF_PI", "PI", "QUARTER_PI", "TAU", "TWO_PI",
    "preload", "setup", "draw", "remove", "noLoop", "loop",
    "push", "pop", "redraw", "print", "frameCount", "focused",
    "cursor", "frameRate", "noCursor", "displayWidth", "displayHeight", "windowWidth",
    "windowHeight", "windowResized", "width", "height", "fullscreen", "pixelDensity",
    "displayDensity", "getURL", "getURLPath", "getURLParams", "p5.Element", "createCanvas",
    "resizeCanvas", "noCanvas", "createGraphics", "blendMode", "applyMatrix", "resetMatrix",
    "rotate", "rotateX", "rotateY", "rotateZ", "scale", "shearX",
    "shearY", "translate", "p5.TypedDict", "p5.NumberDict", "append", "arrayCopy",
    "concat", "reverse", "shorten", "shuffle", "sort", "splice",
    "subset", "float", "int", "str", "boolean", "byte",
    "char", "unchar", "hex", "unhex", "join", "match",
    "matchAll", "nf", "nfc", "nfp", "nfs", "split",
    "splitTokens", "trim", "deviceOrientation", "accelerationX", "accelerationY", "accelerationZ",
    "pAccelerationX", "pAccelerationY", "pAccelerationZ", "rotationX", "rotationY", "rotationZ",
    "pRotationX", "pRotationY", "pRotationZ", "setMoveThreshold", "setShakeThreshold", "deviceMoved",
    "deviceTurned", "deviceShaken", "keyIsPressed", "key", "keyCode", "keyPressed",
    "keyReleased", "keyTyped", "keyIsDown", "mouseX", "mouseY", "pmouseX",
    "pmouseY", "winMouseX", "winMouseY", "pwinMouseX", "pwinMouseY", "mouseButton",
    "mouseIsPressed", "mouseMoved", "mouseDragged", "mousePressed", "mouseReleased", "mouseClicked",
    "doubleClicked", "mouseWheel", "touches", "touchStarted", "touchMoved", "touchEnded",
    "createImage", "saveCanvas", "saveFrames", "p5.Image", "loadImage", "image",
    "tint", "noTint", "imageMode", "pixels", "blend", "copy",
    "filter", "get", "loadPixels", "set", "updatePixels", "loadJSON",
    "loadStrings", "loadTable", "loadXML", "httpGet", "httpPost", "httpDo",
    "save", "saveJSON", "saveStrings", "saveTable", "p5.Table", "p5.TableRow",
    "p5.XML", "day", "hour", "minute", "millis", "month",
    "second", "year", "createVector", "p5.Vector", "abs", "ceil",
    "constrain", "dist", "exp", "floor", "lerp", "log",
    "mag", "map", "max", "min", "norm", "pow",
    "round", "sq", "sqrt", "noise", "noiseDetail", "noiseSeed",
    "randomSeed", "random", "randomGaussian", "acos", "asin", "atan",
    "atan2", "cos", "sin", "tan", "degrees", "radians",
    "angleMode", "textAlign", "textLeading", "textSize", "textStyle", "textWidth",
    "textAscent", "textDescent", "loadFont", "text", "textFont", "p5.Font",
    "camera", "perspective", "ortho", "ambientLight", "directionalLight", "pointLight",
    "loadShader", "shader", "normalMaterial", "texture", "ambientMaterial", "specularMaterial",
    "p5.Texture", "p5.RendererGL", "p5.Shader"
  ];

  // vertices of the cloud shape (calculated manually)
  var cloudPoints = [
    createVector(557, 592),
    createVector(468, 464),
    createVector(497, 318),
    createVector(657, 228),
    createVector(713, 86),
    createVector(874, 26),
    createVector(949, 54),
    createVector(1104, 28),
    createVector(1224, 109),
    createVector(1255, 226),
    createVector(1404, 275),
    createVector(1467, 421),
    createVector(1370, 592),
    createVector(557, 592),
  ]

  // function to draw text under angle
  function angledText(textToDraw, x, y, angle) {
      push();
      translate(x,y);
      rotate(-angle);
      text(textToDraw, 0, 0);
      pop();
  }

  // used in getStringByLength to continue from the last cut position
  var remainderString = "";
  // function that returns randomly generated string containing words that
  // has approximate length in pixels of argument
  function getStringByLength(length) {
    ret = remainderString;

    while(textWidth(ret) < length) {
      word = words[int(random(words.length))];
      ret += word + " ";
    }

    remainderString = "";
    while(textWidth(ret) > length) {
      remainderString = ret.charAt(ret.length - 1) + remainderString;
      ret = ret.substring(0, ret.length - 1);
    }

    return ret;
  }

  //save font and other settings
  push();
  // draw the cloud shape
  strokeWeight(50);
  stroke(255,255,255);
  strokeJoin(ROUND);
  beginShape();
  for(var i = 0; i < cloudPoints.length; i++) {
    vertex(cloudPoints[i].x, cloudPoints[i].y);
  }
  endShape(CLOSE);

  // draw the textual cloud stroke
  textFont("monospace", 30);
  textStyle(BOLD);
  strokeWeight(0);
  fill(0);
  for(var i = 0; i < cloudPoints.length - 1; i++) {
    var startingPoint = cloudPoints[i];
    var endingPoint = cloudPoints[i+1];

    var distance = startingPoint.dist(endingPoint);
    var angle = p5.Vector.sub(endingPoint, startingPoint).heading();

    // use negative angle because math and canvase use different coordinate system
    angledText(getStringByLength(distance), startingPoint.x, startingPoint.y, -angle);
  }
  // restore font and other settings
  pop();

  // write cloud title
  var titleRect = [763, 106, 420, 224];
  textSize(56);
  textAlign(CENTER,TOP);
  text("Processing\nCommunity Day", titleRect[0], titleRect[1], titleRect[2], titleRect[3]);

  // return rectangle for text (calculated manually)
  return [563, 306, 805, 224];
}

register(p5Cloud, "P5.js Cloud", "RedAnt333");
