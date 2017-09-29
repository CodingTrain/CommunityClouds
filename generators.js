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

function straubCloud() {
  stroke(255);
	let r1 = 400;
	let r2 = 200;
	translate(width / 2, height / 2);
	beginShape();
	for(let a = 0; a < 2 * PI;a += 0.001) {
		let x = r1 * cos(a);
		let y = r2 * (sin(a) + noise(a));
		vertex(x, y);
	}
	endShape(CLOSE);
	stroke(255, 0, 50);
	rect(-200, 0, 400, 200);
}

register(straubCloud, "Straub Cloud", "edwin.straub");


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
    return [-cloudWidth/2 + 30, -cloudHeight/2 + 20, cloudWidth - 60, 40];
}
register(randomSimpleCloud, "Simple Random Cloud", "Georges Daou");

