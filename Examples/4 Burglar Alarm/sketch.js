let fromX, fromY, toX, toY;
let step = 2.5;
let rotateSwitch = 0;
let buzzer = false;

let txt = "sleeping...zzz"
let points;
let minMouseDist = 3000;

let initAcceX, initAcceY, initAcceZ;
const THRESH = 0.04;
let calibrated = false;

function setup() {
  createCanvas(400, 400);
  background(0, 20, 80);

  // Setup text animation
  textFont('myriad pro');
  textSize(50);
  points = new Array(txt.length);
  for (let i = 0; i < points.length; i++) {
    points[i] = new Array(2);
  }

  let textW = textWidth(txt);
  let subS = "";

  for (var i = 0; i < txt.length; i++) {
    let charPosn = textWidth(subS);

    points[i][0] = createVector((width - textW) / 2 + textWidth(subS), height / 2);

    subS = subS + txt.charAt(i);
  }
  
}

function draw() {
  bot5Connect();
  
  // Obtain initial values for comparison
  if (isConnected && !calibrated){
    initAcceX = abs(bot5.imu.acceX);
    initAcceY = abs(bot5.imu.acceY);
    initAcceZ = abs(bot5.imu.acceZ);
    calibrated = true;
  }
  
  // Set off burglar alarm if acc detects motion
  if (isConnected && (abs(abs(bot5.imu.acceX)-initAcceX)>THRESH || abs(abs(bot5.imu.acceY)-initAcceY)>THRESH || (bot5.imu.acceZ<1 && bot5.imu.acceZ>0))) {
    burglarAlarm();
    if (!buzzer) {
      bot5.buzzer.setTone(880, 1000);      
      buzzer = true;
    }
  } else {
    // Mute buzzer after 1 second of sleeping
  if (buzzer) {
      bot5.buzzer.mute();
      buzzer = false;
    }
    
    
    fill(255);
    noStroke();
    background(0, 20, 80, 60);
    
    // Animate text
    for (let i = 0; i < points.length; i++) {
      let p = points[i][0];
      let p2 = createVector(0, 0);

      let mouseDist = dist(p.x, p.y, mouseX, mouseY);

      if (mouseDist < minMouseDist) {
        p2 = createVector(p.x - mouseX, p.y - mouseY);

        let distDifference = minMouseDist - mouseDist;
        p2.setMag(sqrt(distDifference));
      }

      points[i][1] = p2;

      text(txt.charAt(i), p.x + p2.x, p.y + p2.y);
    }
    
    // draw point stars
    if (random() > 0.5) {
      stroke(255);
      point(random(width), random(height));
    }

    // Draw shooting stars
    if (random() > 0.95 && step >= 2.5) {
      fromX = random(width);
      fromY = random(height / 2);
      toX = random(fromX + 10, width);
      toY = random(fromY + 10, height / 2);
      step = 0;
    }

    if (step < 2.5) {
      // Fade background
      let nextStep = step + 0.02;
      strokeWeight(3);
      stroke(0, 20, 80, 30);
      line(fromX, fromY, toX, toY);
      strokeWeight(1);
      // Draw star
      if (step < 1) {
        stroke(255, (1 - step) * 200);
        line(lerp(fromX, toX, step), lerp(fromY, toY, step),
          lerp(fromX, toX, nextStep), lerp(fromY, toY, nextStep));
      }
      step = nextStep;
    }

  }


}

function keyPressed() {
  // Reset button
  if (key == 'r') {
    bot5.buzzer.mute();
    buzzer = false;
  }
}

function burglarAlarm() {
  // Animation for burglar alarm
  push();
  background('red');
  textSize(70);
  if (rotateSwitch%2) {
    translate(30, 40);
    rotate(PI / 35);
  } else {
    translate(-10, -100);
    rotate(-PI / 35);
  }
  rotateSwitch++;
  fill(0);
  stroke(255, 255, 0, 200);
  strokeWeight(3);
  text("BURGLAR!!!", 10, height / 2, width);
  pop();
}
