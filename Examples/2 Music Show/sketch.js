const colors = ['red', 'orange', 'yellow', 'blue', 'green', 'pink', 'purple'];
let started = false;
let startTime, endTime;
let sequence = 0;
let font, points, bounds;

function preload() {
  song = loadSound('music.mp3');
  font = loadFont('Avenir.otf');
}

function setup() {
  var c = createCanvas(400, 400);
  c.mousePressed(play);

  background(137, 207, 240);

  // Setup text animation
  points = font.textToPoints(
    'click to start show', 0, 0, 50, {
      sampleFactor: 2,
      simplifyThreshold: 0
    });

  bounds = font.textBounds(
    'click to start show', 0, 0, 50);

  cursor(CROSS);
  noStroke();

}

function draw() {
  bot5Connect();
  if (!started) {
    // Animate text
    background(137, 207, 240);

    let centerDist = dist(mouseX, mouseY, width / 2, height / 2);

    let transparency = map(centerDist, 0, width / 2, 200, 50);
    transparency = constrain(transparency, 50, 200);
    fill(255, transparency);

    let jiggle = map(centerDist, width / 5, width, 1, 300);
    if (centerDist < width / 5) {
      jiggle = 0.5;
    }

    translate((width - abs(bounds.w)) / 2,
      (height + abs(bounds.h)) / 2);

    for (let i = 0; i < points.length; i++) {
      let p = points[i];
      ellipse(p.x + jiggle * randomGaussian(),
        p.y + jiggle * randomGaussian(), 5, 5);
    }
  }

  // Will execute once user has clicked on start
  else {
    currentTime = millis();
    // Draw circles at random positions
    fill(random(colors));
    ellipse(random(0, width), random(0, height), random(5, 80));

    // Sequence num will increment every 700ms
    if (currentTime - startTime >= 700) {
      sequence++;
      // Sequence will repeat
      if (sequence == 45) {
        sequence = 0;
      }

      // Display CLAP if robot is moving claw
      if (sequence == 11 || sequence == 12 || sequence == 19 || sequence == 20 || sequence == 27 || sequence == 28) {
        push()
        stroke(50);
        strokeWeight(10);
        textStyle(BOLD);
        textFont('Courier New');
        textAlign(CENTER, CENTER);
        textSize(150);
        text('CLAP', 40, height / 2, width);
        pop();
      }

      // Robot will clap only after 70s since start
      if (millis() - endTime > 70000) {
        if (sequence < 10 || sequence > 12) {
          sequence = 10;
        }
      }

      // Dance sequence
      switch (sequence) {
        case 0:
          break;
        case 1:
          bot5.motor.turnLeft(25);
          break;
        case 2:
          bot5.motor.turnRight(50);
          break;
        case 3:
          bot5.motor.turnLeft(50);
          break;
        case 4:
          bot5.motor.turnRight(50);
          break;
        case 5:
          bot5.motor.turnLeft(50);
          break;
        case 6:
          bot5.motor.turnRight(50);
          break;
        case 7:
          bot5.motor.turnLeft(50);
          break;
        case 8:
          bot5.motor.turnRight(50);
          break;
        case 9:
          bot5.motor.turnLeft(25);
          break;
        case 10:
          bot5.motor.stop();
          break;
        case 11:
          bot5.servo.setAngle(1, 0);
          break;
        case 12:
          bot5.servo.setAngle(1, 90);
          break;
        case 13:
          bot5.motor.left(30);
          break;
        case 14:
          bot5.motor.right(30);
          break;
        case 15:
          bot5.motor.right(30);
          break;
        case 16:
          bot5.motor.left(30);
          break;
        case 17:
          bot5.motor.left(30);
          break;
        case 18:
          bot5.motor.stop();
          break;
        case 19:
          bot5.servo.setAngle(1, 0);
          break;
        case 20:
          bot5.servo.setAngle(1, 90);
          break;
        case 21:
          bot5.motor.right(30);
          break;
        case 22:
          bot5.motor.forward(30);
          break;
        case 23:
          bot5.motor.back(30);
          break;
        case 24:
          bot5.motor.back(30);
          break;
        case 25:
          bot5.motor.forward(30);
          break;
        case 26:
          bot5.motor.stop();
          break;
        case 27:
          bot5.servo.setAngle(1, 0);
          break;
        case 28:
          bot5.servo.setAngle(1, 90);
          break;
        case 29:
          bot5.motor.turnLeft(25);
          break;
        case 30:
          bot5.motor.turnRight(50);
          break;
        case 31:
          bot5.motor.turnLeft(50);
          break;
        case 32:
          bot5.motor.turnRight(50);
          break;
        case 33:
          bot5.motor.turnLeft(50);
          break;
        case 34:
          bot5.motor.turnRight(25);
          break;
        case 35:
          bot5.motor.stop();
          break;
        case 36:
          bot5.led.setBrightness(255);
          break;
        case 37:
          bot5.led.setBrightness(0);
          break;
        case 38:
          bot5.motor.turnRight(50);
          break;
        case 39:
          bot5.motor.turnRight(50);
          break;
        case 40:
          bot5.motor.turnRight(50);
          break;
        case 41:
          bot5.motor.turnRight(50);
          break;
        case 42:
          bot5.motor.stop();
          break;
        case 43:
          bot5.buzzer.setTone(880, 2000);
          break;
        case 44:
          bot5.buzzer.mute();
          break;
      }

      startTime = currentTime;

    }
  }

}

function play() {
  // Back to setup if canvas is clicked on during show
  if (song.isPlaying()) {
    song.stop();
    started = false;
    bot5.motor.stop();
    sequence = 0;
    setup();
  } else {
    song.play();
    started = true;
    startTime = millis();
    endTime = millis();
    background(137, 207, 240);
  }
}