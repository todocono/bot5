// P5 library

const serviceUuid = "417c891e-f837-4a72-a097-ed1a8c4a4840";
// const serviceUuid = "1efd3aa6-5cb4-11eb-ae93-0242ac130002";
// const serviceUuid = "f6a44d18-6e45-4630-b85e-da3817f10edd";
// const serviceUuid = "f6a44d18-6e45-4630-b85e-da3817f10edd";
// const rxUuid = "f6a44d18-6e45-4631-b85e-da3817f10edd";
// const txUuid = "f6a44d18-6e45-4632-b85e-da3817f10edd";

let myCharacteristic;
let input;
let bot5;
let brightnessSlider;
let isConnected = false;

function setup() {
  createCanvas(600, 500);
  bot5 = new Bot5();

  // Create a 'Connect' button
  const connectButton = createButton('Connect');
  connectButton.mousePressed(connectToBle);
  const disconnectButton = createButton('Disconnect');
  disconnectButton.mousePressed(disconnectToBle);

  // const notificationButton = createButton('Notification');
  // notificationButton.mousePressed(startNotifications);

  // const onButton = createButton('On');
  // const offButton = createButton('Off');
  // const forwardButton = createButton("forward");
  // const backButton = createButton("back");
  // const leftButton = createButton("left");
  // const rightButton = createButton("right");
  // const toneButton = createButton("tone");
  // const setVolumeButton = createButton("setVolume");
  // const getVolumeButton = createButton("getVolume");
  // const muteButton = createButton("mute");
  // const imuButton = createButton("imu");
  const dispColor = createSelect();
  const colorButton = createButton("Color");
  const content = createInput();
  const stringButton = createButton("String");
  stringButton.mousePressed(() => {
    bot5.lcd.displayString(content.value(), 10, 50,
                           bot5.lcd.GREEN,
                           bot5.lcd.NAVY,
                           8)
  })
  // const timeButton = createButton("time");
  // const dateButton = createButton("date");
  dispColor.option("black");
  dispColor.option("red");
  dispColor.option("green");
  dispColor.option("blue");
  dispColor.option("white");
  colorButton.mousePressed(() => {

    switch(dispColor.value()) {
      case "black": {
        bot5.lcd.displayColor(bot5.lcd.BLACK);
        break;
      }
      case "red": {
        bot5.lcd.displayColor(bot5.lcd.RED);
        break;
      }
      case "green": {
        bot5.lcd.displayColor(bot5.lcd.GREEN);
        break;
      }
      case "blue": {
        bot5.lcd.displayColor(bot5.lcd.BLUE);
        break;
      }
      case "white": {
        bot5.lcd.displayColor(bot5.lcd.WHITE);
        break;
      }
    }
  })

  // onButton.mousePressed(ledOn);
  // offButton.mousePressed(ledOff);
  // forwardButton.mousePressed(() => { bot5.motor.forward(127) });
  // backButton.mousePressed(() => { bot5.motor.back(127) });
  // leftButton.mousePressed(() => { bot5.motor.left(127) });
  // rightButton.mousePressed(() => { bot5.motor.right(127) });
  // forwardButton.mouseReleased(() => { bot5.motor.stop() });
  // backButton.mouseReleased(() => { bot5.motor.stop() });
  // leftButton.mouseReleased(() => { bot5.motor.stop() });
  // rightButton.mouseReleased(() => { bot5.motor.stop() });
  // toneButton.mousePressed(() => { bot5.buzzer.setTone(int(freq.value()), 2000) });
  // muteButton.mousePressed(() => { bot5.buzzer.mute() });
  // setVolumeButton.mousePressed(() => bot5.buzzer.setVolume(100));
  // getVolumeButton.mousePressed(() => bot5.buzzer.getVolume());
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
  console.log("Connect");
  // bot5.statNotifications();
}

function disconnectToBle() {
  bot5.disconnect();
}

function startNotifications() {
  bot5.startNotifications();
}


function listenTime(){
  setInterval(() => { bot5.rtc.getTime();}, 1000 );
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
  text("Distance:", 10, 440);
  text(bot5.ultrasonic.distance, 10, 460);
  ellipse(200, bot5.imu.gyroX + 100, 2, 2);
  ellipse(220, bot5.imu.gyroY + 100, 2, 2);
  ellipse(240, bot5.imu.gyroZ + 100, 2, 2);
  ellipse(200, bot5.imu.acceX + 200, 2, 2);
  ellipse(220, bot5.imu.acceY + 200, 2, 2);
  ellipse(240, bot5.imu.acceZ + 200, 2, 2);
  ellipse(200, bot5.imu.pitch + 300, 2, 2);
  ellipse(220, bot5.imu.roll + 300, 2, 2);
  ellipse(240, bot5.imu.yaw + 300, 2, 2);

}
