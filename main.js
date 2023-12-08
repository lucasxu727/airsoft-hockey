//canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const cwidth = innerWidth;
const cheight = innerHeight;

class Player {
  constructor(x, y, radius, colour, yvelocity, xvelocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    this.yvelocity = yvelocity;
    this.xvelocity = xvelocity;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.xvelocity;
    this.y += this.yvelocity;
    if (this.x - this.radius < 0) this.x = this.radius;
    if (this.x + this.radius > cwidth / 2) this.x = cwidth / 2 - this.radius;
    if (this.y - this.radius < 0) this.y = this.radius;
    if (this.y + this.radius > cheight) this.y = cheight - this.radius;
    this.draw();
  }
  shoot(xvel, yvel) {
    bullets.push(new Bullet(this.x, this.y, 10, "blue", yvel, xvel));
  }
}

class Enemy {
  constructor(x, y, radius, colour, yvelocity, xvelocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    this.yvelocity = yvelocity;
    this.xvelocity = xvelocity;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.xvelocity;
    this.y += this.yvelocity;
    if (this.x + this.radius > cwidth) this.x = cwidth - this.radius;
    if (this.x - this.radius < cwidth / 2) cwidth + this.radius;
    this.draw();
  }

  shoot(xvel, yvel) {
    bullets.push(new Bullet(this.x, this.y, 10, "red", yvel, xvel));
  }
}

class Bullet {
  constructor(x, y, radius, colour, yvelocity, xvelocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    this.yvelocity = yvelocity;
    this.xvelocity = xvelocity;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.xvelocity;
    this.y += this.yvelocity;
    this.draw();
  }
}

class Ball {
  constructor(x, y, radius, colour, yvelocity, xvelocity, speedlevel) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    this.yvelocity = yvelocity;
    this.xvelocity = xvelocity;
    this.speedlevel = speedlevel;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.xvelocity *= this.speedlevel;
    this.x += this.xvelocity;
    this.y += this.yvelocity;

    this.draw();
  }
}

//global variables
let player = new Player(cwidth / 4, cheight / 2, 30, "blue", 0, 0);
let enemy = new Enemy((3 * cwidth) / 4, cheight / 2, 30, "red", 0, 0);
let ball = new Ball(cwidth / 2, cheight / 2, 30, "white", 0, 0, 1);
let bullets = [];

function animate() {
  ctx.clearRect(0, 0, cwidth, cheight);
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(cwidth / 2, cheight / 2, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(cwidth / 2, cheight / 2, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cwidth / 2, 0);
  ctx.lineTo(cwidth / 2, cheight);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 10;
  ctx.stroke();
  bullets.forEach((bullet) => {
    bullet.update();
  });
  ball.update();
  player.update();
  enemy.update();
  requestAnimationFrame(animate);
}

//key detection
let dPressed = false;
let aPressed = false;
let wPressed = false;
let sPressed = false;
addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyD":
      if (!dPressed) {
        player.xvelocity += 5;
        dPressed = true;
      }
      break;
    case "KeyA":
      if (!aPressed) {
        player.xvelocity -= 5;
        aPressed = true;
      }
      break;
    case "KeyW":
      if (!wPressed) {
        player.yvelocity -= 5;
        wPressed = true;
      }
      break;
    case "KeyS":
      if (!sPressed) {
        player.yvelocity += 5;
        sPressed = true;
      }
      break;
  }
});

addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyD":
      if (dPressed) {
        player.xvelocity -= 5;
        dPressed = false;
      }
      break;
    case "KeyA":
      if (aPressed) {
        player.xvelocity += 5;
        aPressed = false;
      }
      break;
    case "KeyW":
      if (wPressed) {
        player.yvelocity += 5;
        wPressed = false;
      }
      break;
    case "KeyS":
      if (sPressed) {
        player.yvelocity -= 5;
        sPressed = false;
      }
      break;
  }
});

let canshoot = true;
addEventListener("contextmenu", (event) => {
  event.preventDefault();
  let dx = event.clientX - player.x;
  let dy = event.clientY - player.y;
  let angle = Math.atan2(dy, dx);
  let xvelocity = 30 * Math.cos(angle);
  let yvelocity = 30 * Math.sin(angle);
  player.shoot(xvelocity, yvelocity, 2);
});

addEventListener("mousedown", (event) => {
  if (event.buttons == 1) {
    let dx = event.clientX - player.x;
    let dy = event.clientY - player.y;
    let angle = Math.atan2(dy, dx);
    let xvelocity = 10 * Math.cos(angle);
    let yvelocity = 10 * Math.sin(angle);
    player.shoot(xvelocity, yvelocity);
  }
});

//once ball xvel is positive calculate ending position and move there
//once ball is stopped from player collision find furthest point from player and find an angle
//once enemy ai is on the same line of angle, shoot
//maybe add rebounding shots/ricoshet shots later on

animate();
