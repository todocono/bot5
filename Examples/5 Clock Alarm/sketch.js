let cx, cy;
let secondsRadius, minutesRadius, hoursRadius;
let clockDiameter;
let alarmHr, alarmMin;
let gui, hrSlider, minSlider, setButton;
let setVolume = false;
let alarmState = false;

function setup() {
  var cnv = createCanvas(400, 400);
  gui = createGui();
  
  // Create sliders
  hrSlider = createSliderV("hour", 20, 20, width/15, height-50, 0, 23);
  minSlider = createSliderV("min", width-40, 20, width/15, height-50, 0, 59);
  
  gui.setRounding(0);
  gui.setTrackWidth(0);
  gui.setTextSize(15);
  
  stroke(255);
  background(255);
  let radius = min(width - 100, height-100) / 2;
  secondsRadius = radius * 0.71;
  minutesRadius = radius * 0.6;
  hoursRadius = radius * 0.5;
  clockDiameter = radius * 1.5;

  cx = width / 2;
  cy = height / 2;
  
  hrAlarm = createGraphics(50, 30);
  minAlarm = createGraphics(50, 30);
  
  setButton = createButton('set alarm', width/2-35, height-25, 70, 20);
  setButton.onPress = ()=>{
    setAlarm();
  }
  // setInterval(() => {
  //   bot5.rtc.getTime();},5000);
  
}

function draw() {
  bot5Connect();
  background(255);
  drawGui();
  
  if (isConnected&&!setVolume){
    bot5.buzzer.setVolume(100);
    setVolume = true;
  }
  
  // Draw the clock background
  noStroke();
  fill(200);
  ellipse(cx, cy, clockDiameter + 25, clockDiameter + 25);
  fill(255);
  ellipse(cx, cy, clockDiameter, clockDiameter);

  let s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  let m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  let h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;
  
  // Draw digital clock
  push();
  stroke(0);
  textAlign(CENTER);
  textSize(50);
  textStyle(BOLD);
  text(nf(hour(), 2, 0) + ':' + nf(minute(), 2, 0) + ':' + nf(second(), 2, 0), width/2, height/7);
  pop();

  // Draw the hands of the clock
  stroke('red');
  strokeWeight(1);
  line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
  stroke(100);
  strokeWeight(2);
  line(cx, cy, cx + cos(m) * minutesRadius, cy + sin(m) * minutesRadius);
  stroke(0);
  strokeWeight(4);
  line(cx, cy, cx + cos(h) * hoursRadius, cy + sin(h) * hoursRadius);
  
  

  // Draw the minute ticks
  stroke(0);
  strokeWeight(2);
  beginShape(POINTS);
  for (let a = 0; a < 360; a += 6) {
    let angle = radians(a);
    let x = cx + cos(angle) * secondsRadius;
    let y = cy + sin(angle) * secondsRadius;
    vertex(x, y);
  }
  endShape();
  
  x = cx+cos(PI + HALF_PI) * secondsRadius - 5;
  y = cy+sin(PI + HALF_PI) * secondsRadius - 8;
  text("XII", x, y);
  
  x = cx+cos(TWO_PI) * secondsRadius + 8;
  y = cy+sin(TWO_PI) * secondsRadius + 5;
  text("III", x, y);
  
  x = cx+cos(HALF_PI) * secondsRadius - 5;
  y = cy+sin(HALF_PI) * secondsRadius + 16;
  text("VI", x, y);
  
  x = cx+cos(PI) * secondsRadius - 18;
  y = cy+sin(PI) * secondsRadius + 5;
  text("IX", x, y);
  
  // Draw alarm
  push()
  hrAlarm.background(100);
  minAlarm.background(100);
  image(hrAlarm, width/2-60, height-height/6);
  image(minAlarm, width/2+10, height-height/6);
  noStroke();
  textSize(20);
  textFont('verdana');
  textStyle(BOLD);
  text(nf(int(hrSlider.val),2,0), width/2-width/8, height-height/9);
  text(nf(int(minSlider.val),2,0), width/2+width/18, height-height/9);
  stroke(0);
  text(':', width/2-3, height-height/9);
  pop();
  
  if (hour()==alarmHr && minute()===alarmMin && alarmState == false){
    alarm();
    alarmState = true;
  }
  
  // if(bot5.rtc.hour == alarmHr && bot5.rtc.minute == alarmMin) {
  //   bot5.buzzer.setTone(880, 2000);
  // }
  
  //bot5.rtc.getTime();
  // console.log(bot5.rtc.hour, bot5.rtc.minute, bot5.rtc.second);
  
  
}

function setAlarm(){
  console.log('Alarm set to ' + nf(int(hrSlider.val), 2, 0) + ':' + nf(int(minSlider.val), 2, 0) + '.');
  alarmHr = int(hrSlider.val);
  alarmMin = int(minSlider.val);
  //bot5.rtc.setTime(hour(), minute(), second());
}

function alarm(){
  bot5.buzzer.setTone(2000, 2000);
  setTimeout(()=>{
    bot5.motor.forward(50);
  }, 500);
}



function keyPressed(){
   if (key == 'b' && isConnected){
    bot5.buzzer.setTone(880, 5000);
   }
  else if (key == 'r'){
    bot5.buzzer.mute();
    setTimeout(()=>{
    bot5.motor.stop();
  }, 500);
  }
 }


// Prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}