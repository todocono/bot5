let x1 = 200;
let y1 = 380;
let x2 = 214;
let y2 = 380;
let x3 = 207;
let y3 = 360;

let x1_1, y1_1, x2_1, y2_1, x3_1, y3_1;
let k;

let x4, y4, x4_1, y4_1;

let move = false;

let a1 = 0;

let bg;
let bgY1 = 0;
let bgY2;
let scrollSpeed = 0.5;

let angle = 0;
let dir = 0;

function preload() {
  bg = loadImage('background.jpg');
}

function setup() {
  createCanvas(400, 400);
  background(bg);
  bgY2 = height + 1;
}


function draw() {
  bot5Connect();

  // Background scrolling
  if (move) {
    tint(255, 255);
    image(bg, 0, bgY1, width, height);
    image(bg, 0, bgY2, width, height);
  } else {
    tint(255, 20);
    image(bg, 0, bgY1, width, height);
    image(bg, 0, bgY2, width, height);
  }

  if (bgY1 > height) {
    bgY1 = -height;
  }
  if (bgY2 > height) {
    bgY2 = -height;
  }

  // Robot
  Rotate();
  control();
  stayOnScreen();


  drawLine();

  if (angle < 180 && dir == 0) {
    angle += 3;
  } else {
    dir = 1;
    angle -= 3;
    if (angle == 0) {
      dir = 0;
    }
  }

}

function drawLine() {
  push();
  strokeWeight(5);
  stroke(0, 255, 0);
  translate(x3, y3);
  line(0, 0, (180 / 2) * cos(radians(angle)), (-180 / 2) * sin(radians(angle)));
  pop();
}


function keyReleased() {
  move = false;
  bot5.motor.stop();
}


function stayOnScreen() {
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


/*********/

//x= (x1 - x2)*cos(θ) + (y1 - y2)*sin(θ) + x2 ; y= -(x1 - x2)*sin(θ) + (y1 - y2)*cos(θ) + y2 ;

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
  if (keyIsDown(87)) {
    forward(3);
    bgY1 += scrollSpeed;
    bgY2 += scrollSpeed;
    // background(137, 207, 240);
    if (move == false) {
      bot5.motor.forward(50);
      move = true;
    }
  } else if (keyIsDown(88)) {
    back(3);
    // background(137, 207, 240);
    if (move == false) {
      bot5.motor.back(50);
      move = true;
    }
  } else if (keyIsDown(65)) {
    left(2);
    // background(137, 207, 240);
    if (move == false) {
      bot5.motor.left(50);
      move = true;
    }
  } else if (keyIsDown(68)) {
    right(2);
    // background(137, 207, 240);
    if (move == false) {
      bot5.motor.right(50);
      move = true;
    }
  } else if (keyIsDown(81)) {
    a1 += PI / 60;
    // background(137, 207, 240);
    if (move == false) {
      bot5.motor.turnRight(35);
      move = true;
    }
  } else if (keyIsDown(69)) {
    a1 -= PI / 60;
    // background(137, 207, 240);
    if (move == false) {
      bot5.motor.turnLeft(35);
      move = true;
    }
    e
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
