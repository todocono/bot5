// P5 library

const serviceUuid = "417c891e-f837-4a72-a097-ed1a8c4a4840";
// const rxUuid = "f6a44d18-6e45-4631-b85e-da3817f10edd";
// const txUuid = "f6a44d18-6e45-4632-b85e-da3817f10edd";

let myCharacteristic;
let input;
let bot5;
let brightnessSlider;
let isConnected = false;

function setup() {
  createCanvas(600, 460);
  bot5 = new Bot5();

  // Create a 'Connect' button
  const connectButton = createButton('Connect');
  connectButton.mousePressed(connectToBle);

  const notificationButton = createButton('Notification');
  notificationButton.mousePressed(startNotifications);

  const onButton = createButton('On');
  const offButton = createButton('Off');
  const forwardButton = createButton("forward");
  const backButton = createButton("back");
  const leftButton = createButton("left");
  const rightButton = createButton("right");
  const toneButton = createButton("tone");
  const setVolumeButton = createButton("setVolume");
  const getVolumeButton = createButton("getVolume");
  const getGyroButton = createButton("getGyro");
  const getAcceButton = createButton("getAcce");
  const getAhrsButton = createButton("getAhrs");
  const getTempButton = createButton("getTemp");
  const toneSlider = createSlider(440, 1200);
  const muteButton = createButton("mute");
  const imuButton = createButton("imu");
  const freq = createInput()
  onButton.mousePressed(ledOn);
  offButton.mousePressed(ledOff);
  forwardButton.mousePressed(() => { bot5.motor.forward(127) });
  backButton.mousePressed(() => { bot5.motor.back(127) });
  leftButton.mousePressed(() => { bot5.motor.left(127) });
  rightButton.mousePressed(() => { bot5.motor.right(127) });
  forwardButton.mouseReleased(() => { bot5.motor.stop() });
  backButton.mouseReleased(() => { bot5.motor.stop() });
  leftButton.mouseReleased(() => { bot5.motor.stop() });
  rightButton.mouseReleased(() => { bot5.motor.stop() });
  toneButton.mousePressed(() => { bot5.buzzer.setTone(int(freq.value()), 2000) });
  muteButton.mousePressed(() => { bot5.buzzer.mute() });
  setVolumeButton.mousePressed(() => bot5.buzzer.setVolume(100));
  getVolumeButton.mousePressed(() => bot5.buzzer.getVolume());
  getGyroButton.mousePressed(() => {
    bot5.imu.getGyro();
    console.log(bot5.imu.gyroX, bot5.imu.gyroY, bot5.imu.gyroZ);
  });
  getAcceButton.mousePressed(() => {
    bot5.imu.getAcce();
    console.log(bot5.imu.acceX, bot5.imu.acceY, bot5.imu.acceZ);
  });
  getAhrsButton.mousePressed(() => {
    bot5.imu.getAhrs();
    console.log(bot5.imu.pitch, bot5.imu.yaw, bot5.imu.roll);
  });
  getTempButton.mousePressed(() => {
    bot5.imu.getTemp();
    console.log(bot5.imu.temp);
  });
  imuButton.mousePressed(listenIMU);
}

function ledOn() {
  bot5.led.setBrightness(255);
  console.log("LED on");
}

function ledOff() {
  bot5.led.setBrightness(0);
  console.log("LED off");
}

function connectToBle() {
  // Connect to a device by passing the service UUID
  bot5.connect(serviceUuid);
  // bot5.startNotifications();
}

function startNotifications() {
  bot5.startNotifications();
}

function listenIMU() {
  var interval = 100;
  var currInt = 0;
  setInterval(() => {
    setTimeout(() => { bot5.imu.getGyro(); }, currInt += interval);
    setTimeout(() => { bot5.imu.getAcce(); }, currInt += interval);
    setTimeout(() => { bot5.imu.getAhrs(); }, currInt += interval);
    setTimeout(() => { bot5.imu.getTemp(); }, currInt += interval);
    setTimeout(() => { bot5.button.getStateA(); }, currInt += interval);
    setTimeout(() => { bot5.button.getStateB(); }, currInt += interval);
  }, interval * 6);
}

function draw() {

  background(220);
  textSize(12);
  text("Gyro:", 10, 20);
  text(bot5.imu.gyroX, 10, 40);
  text(bot5.imu.gyroY, 10, 60);
  text(bot5.imu.gyroZ, 10, 80);
  text("Acce:", 10, 120);
  text(bot5.imu.acceX, 10, 140);
  text(bot5.imu.acceY, 10, 160);
  text(bot5.imu.acceZ, 10, 180);
  text("Ahrs:", 10, 220);
  text(bot5.imu.pitch, 10, 240);
  text(bot5.imu.yaw, 10, 260);
  text(bot5.imu.roll, 10, 280);
  text("Temp:", 10, 320);
  text(bot5.imu.temp, 10, 340);
  text("Button A:", 10, 360);
  text(bot5.button.a, 10, 380);
  text("Button B:", 10, 400);
  text(bot5.button.b, 10, 420);
  ellipse(200, bot5.imu.gyroX / 10 + 100, 2, 2)
  ellipse(220, bot5.imu.gyroY / 10 + 100, 2, 2)
  ellipse(240, bot5.imu.gyroZ / 10 + 100, 2, 2)
  ellipse(200, bot5.imu.acceX + 200, 2, 2)
  ellipse(220, bot5.imu.acceY + 200, 2, 2)
  ellipse(240, bot5.imu.acceZ + 200, 2, 2)
  ellipse(200, bot5.imu.pitch / 100 + 300, 2, 2)
  ellipse(220, bot5.imu.roll / 100 + 300, 2, 2)
  ellipse(240, bot5.imu.yaw / 100 + 300, 2, 2)
  // onTimeout(() => {
  //   bot5.button.getStateA();
  //   console.log("button A:", bot5.button.a);
  // }, 500);
  // onTimeout(() => {
  //   bot5.button.getStateB();
  //   console.log("button B:", bot5.button.b);
  // }, 500);
  // var brightness = brightnessSlider.value();
  // bot5.led.setBrightness(brightness);
  // console.log("Brightness", brightness);
  // myBLE.write(myCharacteristic, value);
}
