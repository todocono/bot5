//how many frames it takes to move a space invader
let MOVE_INTERVAL = 30;
//how many frames between invader's shots
const SHOT_PAUSE = 1000;//300;
//how long the player is invincible after hit
const PLAYER_INVINCIBLE = 60 * 2 - 20;
const scale = 3;

let oldRoll = 0;

let invaders = [];
let bullets = [],
	invaderBullets = [];
let player;

let invaderImg, invader2Img, spaceshipImg, bullet2Img, barrierImg;
let invaderFont;

let frameCount = 0;
let invaderSpeed = 1;

let playerLives, score, win, streak;

let initGyroX;
let calibrated = false;
const THRESH = 50;

function preload() {
	invaderImg = loadImage("invader.png");
	invader2Img = loadImage("invader2.png");
	spaceshipImg = loadImage("spaceship.png");
	bulletImg = loadImage("bullet.png");
	bullet2Img = loadImage("bullet2.png");

	//"cosmic alien" font
	invaderFont = loadFont("ca.ttf");
}

function setup() {
  console.log(Math.min(500, window.innerWidth));
	createCanvas(Math.min(500, window.innerWidth), Math.min(500, window.innerWidth));
	noSmooth();
	textFont(invaderFont);

	//create barrier image
	barrierImg = createImage(1, 1);
	barrierImg.set(0, 0, color(255, 0, 255));

	//create invaders
	let invWidth = scale * invaderImg.width,
		invHeight = scale * invaderImg.height;

	let x = -(scale * 5 + invWidth) + scale,
		y = scale,
		yidx = 0;
	for (let i = 0; i < 9 * 4; ++i) {
		x += scale * 5 + invWidth;
		if (x >= width - invWidth * 3) {
			y += scale * 5 + invHeight;
			yidx++;
			x = scale;
		}
		invaders.push(new Invader(x, y, invWidth, invHeight, (yidx % 2 == 0) ? invaderImg : invader2Img));
	}

	//create player
	player = new Player(width / 2, height - spaceshipImg.height * scale, spaceshipImg.width * scale, spaceshipImg.height * scale, spaceshipImg);

	playerLives = 2;
	score = streak = 0;
	win = false;

	MOVE_INTERVAL = 30;
  

	loop();
}

function draw() {
    bot5Connect();
	frameCount++;
	streak = max(streak - 0.02, 0);

	//logic
  
    move();
	player.update(frameCount);

	for (let bullet of invaderBullets) {
		bullet.update(frameCount);
		if (isConnected && !player.invincible && player.intersects(bullet)) {
			bullet.deadMarked = true;
			gameOver();
		}
	}
    
    

	for (let invader of invaders) {
		invader.update(frameCount);
		bullets.forEach(bullet => {
			if (bullet.intersects(invader)) {
				score += floor((1 / MOVE_INTERVAL) * 300 * streak);
				streak += 1;
				if (invader.img === invader2Img) score += 10;
				MOVE_INTERVAL -= 0.1;
				bullet.deadMarked = true;
				invader.deadMarked = true;
			}
		});
	}
	for (let bullet of bullets) {
		bullet.update(frameCount);
	}
	if (invaders.some(invader => invader.right() >= width || invader.left() <= 0))
		invaders.forEach(invader => {
			invader.pos.add(p5.Vector.mult(invader.vel, -1));
			invader.pos.y += scale * 5;
			invader.vel.x = -invader.vel.x;
		});

	//deletion of bullets and invaders
	bullets = bullets.filter(bullet => !bullet.deadMarked && bullet.lower() >= 0);
	invaderBullets = invaderBullets.filter(bullet => !bullet.deadMarked && bullet.upper() <= height);
	invaders = invaders.filter(invader => !invader.deadMarked);

	if (invaders.length == 0) {
		win = true;
	}

	//draw
	background(0);

	for (let invader of invaders) {
		invader.draw();
	}
	for (let bullet of bullets) {
		bullet.draw();
	}
	for (let bullet of invaderBullets) {
		bullet.draw();
	}
  
    
	player.draw();

	noStroke();
	fill(255);
	textSize(28);
	textAlign(LEFT, TOP);
	text(`Lives ${playerLives}\nStreak ${round(streak*10)/10}`, 0, 0);
	textAlign(RIGHT, TOP);
	fill(win ? 0 : 255, 255, win ? 0 : 255)
	text(`${score}\nHi ${hs()}`, width, 0);

	if (playerLives < 0) {
		textAlign(CENTER, CENTER);
		textSize(64);
		text("GAME OVER", width / 2, height / 2);
	}

	if (win) {
		//score logic and storing highscore in cookie
		score += playerLives * 100;
		if (score > hs()) {
			setHs(score);
		}

		textAlign(RIGHT, TOP);
		fill(win ? 0 : 255, 255, win ? 0 : 255)
		text(`${score}\nHi ${hs()}`, width, 0);

		textAlign(CENTER, CENTER);
		textSize(64);
		text("YOU WIN", width / 2, height / 2);

		noLoop();
	}
    
}

function keyPressed() {
  restart();
}

 function move() {
  if (isConnected){
   if (!calibrated){
     initX = bot5.imu.roll;
     calibrated = true;
   }
    let playerX = bot5.imu.roll;
    if (bot5.button.a){
      player.shoot();
    }
    if (playerX>initX){
      if (player.pos.x<width-spaceshipImg.width*scale){
        player.move(scale);}
    }
    else if (playerX<initX){
      if (player.pos.x>0){
      player.move(-scale);
      }
    }
  }
 }
    


function mousePressed() {
	return false;
}

function mouseDragged() {
	return false;
}

function createBullet(x, y) {
	bulletPrefab = new Sprite(x, y, bulletImg.width * scale, bulletImg.height * scale, bulletImg);
	bulletPrefab.vel = createVector(0, -scale * 2);
	bulletPrefab.deadMarked = false;
	bulletPrefab.update = function updateBullet(frameCount) {
		this.pos.add(this.vel);
	}
	return bulletPrefab;
}

function gameOver() {
	playerLives--;
	//make player invincible
	player.invincible = true;

	if (playerLives < 0) {
		console.log("GAME OVER");
		restart();
	}
}

function restart() {
	redraw();
	noLoop();

	setTimeout(() => {
		invaders = [];
		bullets = [];
		invaderBullets = [];
		player.pos.x = width / 2;

		setup();
	}, 3000);
}

//returns high score read from browser cookie. That's not a bad cookie!
const hs = () => document.cookie.replace(/(?:(?:^|.*;\s*)highscore\s*\=\s*([^;]*).*$)|^.*$/, '$1');
const setHs = val => document.cookie = `highscore=${val}`;

const sign = n => n > 0 ? 1 : n === 0 ? 0 : -1;
