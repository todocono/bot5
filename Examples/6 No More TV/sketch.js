let gui, j, b;
const MAX_SPEED = 127;

function setup() {
  createCanvas(400, 400);
  background(255);
  cursor('grab');
  
  gui = createGui();
  j = createJoystick("robot control", width/4, height/6, 200, 200, -MAX_SPEED, MAX_SPEED, -MAX_SPEED, MAX_SPEED);
  j.setStyle({
    rounding: 20,
    handleRadius: 30,
    fillHandle: color('red'),
});
  b = createButton("TV OFF", width/2-50, height-height/4, 100, 50)
  b.setStyle({
    fillBg: color("red"),
    rounding: 10,
    textSize: 25,
    font: 'consolas'
});
  
  b.onPress = function() {
    bot5.led.setBrightness(255);
    console.log("pressed");
  }
  
  b.onRelease = function() {
    bot5.led.setBrightness(0);
    console.log("released");
  }
  
}

function draw() {
  bot5Connect();
  drawGui();
  
  if (j.isChanged) {
    move();
  }
  
}

function move(){
  if (abs(abs(j.valX)-abs(j.valY))<10){
    if (j.valX<-60){
      bot5.motor.turnLeft(abs(j.valX)-60);
    }
    else if (j.valX>60){
      bot5.motor.turnRight(abs(j.valX)-60);
    }
    else{
      bot5.motor.stop();
    }
  }
  else if (j.valY>-j.valX && j.valY>j.valX){
    bot5.motor.forward(abs(j.valY));
  }
  else if (j.valY<-j.valX && j.valY>j.valX){
    bot5.motor.left(abs(j.valX));
  }
  else if (j.valY<-j.valX && j.valY<j.valX){
    bot5.motor.back(abs(j.valY));
  }
  else if (j.valY>-j.valX && j.valY<j.valX){
    bot5.motor.right(abs(j.valX));
  }
  else{
    bot5.motor.stop();
  }
}

function keyPressed(){
  if (key == 'w'){
    bot5.motor.forward(50);
  }
  else if (key == 'x'){
    bot5.motor.back(50);
  }
  else if (key == 'a'){
    bot5.motor.left(50);
  }
  else if (key == 'd'){
    bot5.motor.right(50);
  }
  else if (key == 's'){
    bot5.motor.stop();
  }
  else if (key == 'q'){
    bot5.motor.turnLeft(50);
  }
  else if (key == 'e'){
    bot5.motor.turnRight(50);
  }
  else if (key == ' '){
    bot5.led.setBrightness(255);
  }
}
function keyReleased(){
  bot5.motor.stop();
  //bot5.led.setBrightness(0);
}
// Prevent scrolling on mobile
function touchMoved() {
  return false;
}