// P5 library

const serviceUuid = "f6a44d18-6e45-4630-b85e-da3817f10edd";
// const rxUuid = "f6a44d18-6e45-4631-b85e-da3817f10edd";
// const txUuid = "f6a44d18-6e45-4632-b85e-da3817f10edd";

let myCharacteristic;
let input;
let bot5;
let brightnessSlider;
let isConnected = false;

function setup() {
  bot5 = new Bot5();

  // Create a 'Connect' button
  const connectButton = createButton('Connect')
  connectButton.mousePressed(connectToBle);

  const onButton = createButton('On');
  const offButton = createButton('Off');
  onButton.mousePressed(ledOn);
  offButton.mousePressed(ledOff);
  brightnessSlider = createSlider(0, 255, 100);
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
}

function draw() {
  if (bot5.isConnected()) {
    // var brightness = brightnessSlider.value();
    // bot5.led.setBrightness(brightness);
    // console.log("Brightness", brightness);
    // myBLE.write(myCharacteristic, value);
  } else {
    console.log("not connected")
  }
}
