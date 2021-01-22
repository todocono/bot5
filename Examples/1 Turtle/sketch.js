function setup() {
  var c = createCanvas(600, 400);
  background(137, 207, 240);

  button = createButton('reset');
  button.position(50, 240);
  button.mousePressed(reset);
  button2 = createButton('resetDirection');
  button2.position(100, 240);
  button2.mousePressed(resetDirection);
}

function resetDirection(){
  a1 = 0;
  background(137, 207, 240);
}

function reset() {
  x1 = 293;
  y1 = 400;
  x2 = 307;
  y2 = 400;
  x3 = 300;
  y3 = 380;
  a1 = 0;
  triangle(x1_1, y1_1, x2_1, y2_1, x3_1, y3_1);
  background(137, 207, 240);
}

function draw() {
  Rotate();
  control();
  bot5Connect();

}

function keyReleased() {
  background(137, 207, 240);
  move = false;
  bot5.motor.stop();
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
        if (move == false) {
          bot5.motor.forward(50);
          move = true;
        }
      } else if (keyIsDown(88)) {
        back(3);
        if (move == false) {
          bot5.motor.back(50);
          move = true;
        }
      } else if (keyIsDown(65)) {
        left(2);
        if (move == false) {
          bot5.motor.left(50);
          move = true;
        }
      } else if (keyIsDown(68)) {
        right(2);
        if (move == false) {
          bot5.motor.right(50);
          move = true;
        }
      } else if (keyIsDown(81)) {
        a1 += PI / 60;
        if (move == false) {
          bot5.motor.turnRight(35);
          move = true;
        }
      } else if (keyIsDown(69)) {
        a1 -= PI / 60;
        if (move == false) {
          bot5.motor.turnLeft(35);
          move = true;
        }
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

      // console.log("K",k);
      // console.log("Y4_1",y4_1);
      // console.log("Y3_1",y3_1);
    }


    function back(p) {
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
      console.log("K", k);
    }

    function right(p) {
      left(-p);
    }