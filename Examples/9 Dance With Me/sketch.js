let handpose;
let video;
let predictions = [];
let center, thumb, pinky, tip;
let oldThumb = 0;
let oldPinky = 0;
const SPEED = 50;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);
  
  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
  background(0);

}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  bot5Connect();
  translate(width,0); // move to far corner
  scale(-1.0,1.0);    // flip x-axis backwards
    image(video, 0, 0, width, height);
  // draw outline of hand position
  if (millis()<20000){
    fill(255);
    ellipse(width/2, height/2, 10, 10);
    ellipse(395, 245, 10, 10);
  ellipse(254, 217, 10, 10);
  ellipse(319, 325, 10, 10);
  ellipse(360, 180, 10, 10);
  ellipse(322, 165, 10, 10);
  ellipse(293, 180, 10, 10);
  }
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
        
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
    if (isConnected){
  center =  [prediction.landmarks[9][0], prediction.landmarks[9][1]]
  thumb = [prediction.landmarks[4][0], prediction.landmarks[4][1]];
      pinky = [prediction.landmarks[20][0], prediction.landmarks[20][1]];
      tip = [prediction.landmarks[12][0], prediction.landmarks[12][1]];
      wrist = [prediction.landmarks[0][0], prediction.landmarks[0][1]];
      if (abs(thumb[0]-pinky[0])<20 || !predictions.length||abs(tip[1]-wrist[1])<60){
        bot5.motor.stop();
      }
      else if (abs(thumb[0]-pinky[0]) < 60) {
      if (abs(thumb[0]-pinky[0]) < 60 &&
        abs(oldThumb-thumb[0])>abs(oldPinky-pinky[0])){
        bot5.motor.turnRight(SPEED);
      }
      else if (abs(thumb[0]-pinky[0]) < 50 &&
        abs(oldThumb-thumb[0])<abs(oldPinky-pinky[0])){
        bot5.motor.turnLeft(SPEED);
      }
      }
    else if (center[1] < height/3){
      bot5.motor.forward(SPEED);
    }
      else if (center[1] > height-height/3) {
        bot5.motor.back(SPEED);
      }
  else if (center[0] > width-width/3){
    bot5.motor.left(SPEED);
  }
  else if (center[0] < width/3){
    bot5.motor.right(SPEED);
  }
  else{
    bot5.motor.stop();
  }
      if (abs(thumb[0]-pinky[0]) > 60){
      oldThumb = thumb[0];
      oldPinky = pinky[0];
      }
    }
  }
}