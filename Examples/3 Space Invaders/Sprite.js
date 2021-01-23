class Sprite {
	constructor(x, y, width, height, img) {
		this.pos = createVector(x, y);
		this.size = createVector(width, height);
		this.img = img;
	}

	corner1() {
		return this.pos.copy();
	}

	corner2() {
		return p5.Vector.add(this.pos, this.size);
	}

	width() {
		return this.size.x;
	}
	height() {
		return this.size.y;
	}
	left() {
		return this.pos.x;
	}
	right() {
		return this.width() + this.left();
	}
	upper() {
		return this.pos.y;
	}
	lower() {
		return this.height() + this.upper();
	}

	intersects(other) {
		return !(this.right() < other.left() || other.right() < this.left() || this.lower() < other.upper() || other.lower() < this.upper());
	}

	draw() {
		push();
		image(this.img, this.left(), this.upper(), this.width(), this.height());
		pop();
	}
}

class Invader extends Sprite {
	constructor(x, y, width, height, img) {
		super(x, y, width, height, img);
		this.vel = createVector(scale, 0);
		this.timeToShoot = floor(random(0, SHOT_PAUSE * 5));
	}

	update(frameCount) {
		if (frameCount % MOVE_INTERVAL < 1) {
			this.pos.add(this.vel);
		}
		this.timeToShoot--;
		if (this.timeToShoot <= 0) {
			let b = createBullet(this.left() + this.width() / 2, this.lower());
			b.vel.mult(-0.9);
			invaderBullets.push(b);
			this.timeToShoot = SHOT_PAUSE;
		}
	}

}

class Player extends Sprite {
	constructor(x, y, width, height, img) {
		super(x, y, width, height, img);
		this.vel = createVector(scale / 2, 0);
		this.timeBetweenShots = 20;
		this.shootCooldown = 0;
		this.invincibleCounter = 0;
		this.visible = true;
	}

	update(frameCount) {
		this.shootCooldown--;
		this.invincibleCounter--;
		this.visible = this.invincible ? frameCount % 20 >= 20 / 2 : true;
	}

	move(dir) {
		this.pos.add(p5.Vector.mult(this.vel, sign(dir)));
	}

	shoot() {
		if (this.shootCooldown <= 0) {
			let b = createBullet(this.left() + this.width() / 2, this.upper());
			bullets.push(b);
			this.shootCooldown = this.timeBetweenShots;
		}
	}

	get invincible() {
		return this.invincibleCounter > 0;
	}
	set invincible(inv) {
		this.invincibleCounter = inv ? PLAYER_INVINCIBLE : 0;
	}

	draw() {
		if (!this.visible) return;
		else super.draw();
	}
}

class Barrier extends Sprite {
	constructor(x, y, img) {
		super(x, y, scale, scale, img);
	}
}
