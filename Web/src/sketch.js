// P5 library

const serviceUuid = "f6a44d18-6e45-4630-b85e-da3817f10edd";
const rxUuid = "f6a44d18-6e45-4631-b85e-da3817f10edd";
const txUuid = "f6a44d18-6e45-4632-b85e-da3817f10edd";

let myCharacteristic;
let input;
let myBLE;

function setup() {
  myBLE = new p5ble();

  // Create a 'Connect' button
  const connectButton = createButton('Connect')
  connectButton.mousePressed(connectToBle);

  // Create a text input
  input = createInput();

  // Create a 'Write' button
  const writeButton = createButton('Write');
  writeButton.mousePressed(writeToBle);

  const onButton = createButton('On');
  onButton.mousePressed(ledOn);
  const offButton = createButton('Off');
  offButton.mousePressed(ledOff);
}

function ledOn() {
  var value = new Uint8Array([4,1,0,1]);
  myBLE.write(myCharacteristic, value);
}

function ledOff() {
  var value = new Uint8Array([4,1,0,0]);
  myBLE.write(myCharacteristic, value);
}

function connectToBle() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log('characteristics: ', characteristics);
  // Set the first characteristic as myCharacteristic
  myCharacteristic = characteristics[1];
}

function writeToBle() {
  var inputValue = new Uint8Array([4,1,0,1]);
  // Write the value of the input to the myCharacteristic
  myBLE.write(myCharacteristic, inputValue);
}