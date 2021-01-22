let classifier;
const options = {
  probabilityThreshold: 0.65
};

let label;
let confidence;
let command;
// you can use your own custom pre-trained speech commands
let soundModel = 'https://teachablemachine.withgoogle.com/models/MA3fnR0Rb/'
let bg;

let x1 = 200;
let y1 = 380;
let x2 = 214;
let y2 = 380;
let x3 = 207;
let y3 = 360;

let x1_1, y1_1, x2_1, y2_1, x3_1, y3_1;
let k;

let x4, y4, x4_1, y4_1;

let a1 = 0;

let forwardS = false;
let backS = false;
let leftS = false;
let rightS = false;
let turnLeftS = false;
let turnRightS = false;

function preload() {
  classifier = ml5.soundClassifier(soundModel + 'model.json', options);
  bg = loadImage('bg.jpg')
}

function setup() {
  createCanvas(400, 400);
  label = createDiv('Label: ...');
  confidence = createDiv('Confidence: ...');
  // Classify the sound from microphone in real time
  classifier.classify(gotResult);
  background(bg);
}

function draw() {
  bot5Connect();
  background(bg);
  Rotate();
  control();


  // bot stays on screen
  if (y1 >= height) {
    y3 = y3 - height + 10;
    y2 = y2 - height + 10;
    y1 = y1 - height + 10;
  } else if (y1 <= 30) {
    y3 = 400 + y3 - 10;
    y2 = 400 + y2 - 10;
    y1 = 400 + y1 - 10;
  }

  if (x2 > width) {
    x3 = x3 - width + 10;
    x2 = x2 - width + 10;
    x1 = x1 - width + 10;
  } else if (x2 < 20) {
    x3 = x3 + width - 10;
    x2 = x2 + width - 10;
    x1 = x1 + width - 10;
  }

}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  command = results[0].label
  // Show the first label and confidence
  label.html('Label: ' + command);
  confidence.html('Confidence: ' + nf(results[0].confidence, 0, 2)); // Round the confidence to 0.01
  if (isConnected && results[0].confidence >= 0.65) {
    if (command == 'go') {
      bot5.motor.forward(50);
      forwardS = true;
    } else if (command == 'back') {
      bot5.motor.back(50);
      backS = true;
    } else if (command == 'stop') {
      bot5.motor.stop();
      forwardS = false;
      backS = false;
      leftS = false;
      rightS = false;
      turnLeftS = false;
      turnRightS = false;
    } else if (command == 'left') {
      bot5.motor.left(50);
      leftS = true;
    } else if (command == 'right') {
      bot5.motor.right(50);
      rightS = true;
    } else if (command == 'turn left') {
      bot5.motor.turnLeft(20);
      turnLeftS = true;
    } else if (command == 'turn right') {
      bot5.motor.turnRight(20);
      turnRightS = true;
    } else if (command == 'close') {
      bot5.servo.setAngle(1, 90);
    } else if (command == 'open') {
      bot5.servo.setAngle(1, 0);
    } else if (command == 'yes') {
      bot5.buzzer.setTone(2000);
    } else if (command == 'no') {
      bot5.buzzer.setTone(100);
    } else if (command == 'mute') {
      bot5.buzzer.mute();
    } else if (command == 'on') {
      bot5.led.setBrightness(255);
    } else if (command == 'off') {
      bot5.led.setBrightness(0);
    }
  }

}

function Rotate() {
  fill(252, 241, 125);
  x4 = (x1 + x2 + x3) / 3;
  y4 = (y1 + y2 + y3) / 3;

  x1_1 = (x1 - x4) * Math.cos(a1) + (y1 - y4) * Math.sin(a1) + x4;
  y1_1 = -(x1 - x4) * Math.sin(a1) + (y1 - y4) * Math.cos(a1) + y4;
  x2_1 = (x2 - x4) * Math.cos(a1) + (y2 - y4) * Math.sin(a1) + x4;
  y2_1 = -(x2 - x4) * Math.sin(a1) + (y2 - y4) * Math.cos(a1) + y4;
  x3_1 = (x3 - x4) * Math.cos(a1) + (y3 - y4) * Math.sin(a1) + x4;
  y3_1 = -(x3 - x4) * Math.sin(a1) + (y3 - y4) * Math.cos(a1) + y4;
  x4_1 = (x1_1 + x2_1 + x3_1) / 3;
  y4_1 = (y1_1 + y2_1 + y3_1) / 3;

  triangle(x1_1, y1_1, x2_1, y2_1, x3_1, y3_1);

  if ((y4_1 - y3_1) == 0) {
    k = 100000000;
  } else {
    k = ((x4_1 - x3_1) / (y4_1 - y3_1));
  }

  fill(241, 152, 225);
  // circle(x3_1, y3_1, 10);
}

function control() {
  if (forwardS) {
    forward(3);
  } else if (backS) {
    back(3);
  } else if (leftS) {
    left(2);
  } else if (rightS) {
    right(2);
  } else if (turnRightS) {
    a1 += PI / 60;
  } else if (turnLeftS) {
    a1 -= PI / 60;
  }

  a1 = a1 % (2 * PI);
}


function forward(p) {
  if ((y4_1 - y3_1) == 0 && x4_1 < x3_1) {
    x1 = x1 + p;
    x2 = x2 + p;
    x3 = x3 + p;
  } else if ((y4_1 - y3_1) == 0 && x4_1 > x3_1) {
    x1 = x1 - p;
    x2 = x2 - p;
    x3 = x3 - p;
  } else if (k == 0 && y4_1 > y3_1) {
    y1 = y1 - p;
    y2 = y2 - p;
    y3 = y3 - p;
  } else if (k == 0 && y4_1 < y3_1) {
    y1 = y1 + p;
    y2 = y2 + p;
    y3 = y3 + p;
  } else if (y4_1 > y3_1) {
    if (abs(k) > 1.5) {
      x1 = x1 - k * p * (1 / abs(k));
      x2 = x2 - k * p * (1 / abs(k));
      x3 = x3 - k * p * (1 / abs(k));
      y1 = y1 - p * (1 / abs(k));
      y2 = y2 - p * (1 / abs(k));
      y3 = y3 - p * (1 / abs(k));
    } else {
      x1 = x1 - k * p;
      x2 = x2 - k * p;
      x3 = x3 - k * p;
      y1 = y1 - p;
      y2 = y2 - p;
      y3 = y3 - p;
    }
  } else if (y4_1 < y3_1) {
    if (abs(k) > 1.5) {
      x1 = x1 + k * p * (1 / abs(k));
      x2 = x2 + k * p * (1 / abs(k));
      x3 = x3 + k * p * (1 / abs(k));
      y1 = y1 + p * (1 / abs(k));
      y2 = y2 + p * (1 / abs(k));
      y3 = y3 + p * (1 / abs(k));
    } else {
      x1 = x1 + k * p;
      x2 = x2 + k * p;
      x3 = x3 + k * p;
      y1 = y1 + p;
      y2 = y2 + p;
      y3 = y3 + p;
    }
  }
}


function back(p) {
  // background(137, 207, 240);
  forward(-p);
}

function left(p) {
  if ((y4_1 - y3_1) == 0 && x4_1 > x3_1) {
    y1 = y1 + p;
    y2 = y2 + p;
    y3 = y3 + p;
  } else if ((y4_1 - y3_1) == 0 && x4_1 < x3_1) {
    y1 = y1 - p;
    y2 = y2 - p;
    y3 = y3 - p;
  } else if (k == 0 && y3_1 < y4_1) {
    x1 = x1 - p;
    x2 = x2 - p;
    x3 = x3 - p;
  } else if (k == 0 && y3_1 > y4_1) {
    x1 = x1 + p;
    x2 = x2 + p;
    x3 = x3 + p;
  } else if (x3_1 < x4_1) {
    if (abs(k) < 2) {
      x1 = x1 - (1 / k) * p * abs(k);
      x2 = x2 - (1 / k) * p * abs(k);
      x3 = x3 - (1 / k) * p * abs(k);
      y1 = y1 + p * abs(k);
      y2 = y2 + p * abs(k);
      y3 = y3 + p * abs(k);
    } else {
      x1 = x1 - (1 / k) * p;
      x2 = x2 - (1 / k) * p;
      x3 = x3 - (1 / k) * p;
      y1 = y1 + p;
      y2 = y2 + p;
      y3 = y3 + p;
    }
  } else if (x3_1 > x4_1) {
    if (abs(k) < 2) {
      x1 = x1 + (1 / k) * p * abs(k);
      x2 = x2 + (1 / k) * p * abs(k);
      x3 = x3 + (1 / k) * p * abs(k);
      y1 = y1 - p * abs(k);
      y2 = y2 - p * abs(k);
      y3 = y3 - p * abs(k);
    } else {
      x1 = x1 + (1 / k) * p;
      x2 = x2 + (1 / k) * p;
      x3 = x3 + (1 / k) * p;
      y1 = y1 - p;
      y2 = y2 - p;
      y3 = y3 - p;
    }
  }
  // console.log("K", k);
}


function right(p) {
  left(-p);
}