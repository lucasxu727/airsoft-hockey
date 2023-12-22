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

  update(predy) {
    this.x += this.xvelocity;
    this.y += this.yvelocity;
    if (this.x + this.radius > cwidth) this.x = cwidth - this.radius;
    if (this.x - this.radius < cwidth / 2) cwidth + this.radius;
    this.draw();
  }

  predict() {
    //AI GOES HERE
    //Ball path prediction
    if (ball.xvelocity > 0) { 
      let predx = ball.x;
      let predy = ball.y;
      //predict x position
      let dx = enemy.x - ball.x - 150;
      let xspeedps = ball.xvelocity * 60;
      let btime = Math.sqrt((dx / xspeedps) * (dx / xspeedps));
      predx = ball.x + dx;
      //predict y position
      let dy = ball.yvelocity * 60 * btime;
      let direction;
      let initdist;
      if (dy > 0) {
        //is going down
        direction = 1;
        //initial distance it has to travel before first bounce
        initdist = cheight - ball.y;
        dy = Math.sqrt(dy * dy);
      } else {
        //is going up
        direction = -1;
        //initial distance it has to travel before first bounce
        initdist = ball.y;
        dy = Math.sqrt(dy * dy);
      }
      //check if dy travelled bounces at all
      let bounces = 0;
      let remainderdy = 0;
      if(dy > initdist) {
        bounces++;
        remainderdy = (dy - initdist) % (cheight - (2 * ball.radius));
        bounces += Math.floor((dy - initdist) / (cheight - (2 * ball.radius)));
        if (bounces % 2 == 0) {
        direction *= -1;
      }
      if (direction > 0) {
        predy = cheight - remainderdy - ball.radius;
      } else {
        predy = remainderdy;
      }
      } else {
        //check direction
        if(direction < 0) {
          predy = ball.y - dy; 
        } else {
          predy = ball.y + dy;
        }
      } 
      let dxpred = predx - enemy.x;
      let dypred = predy - enemy.y;
      let bulletangle = Math.atan2(dypred, dxpred);
      let ballvelocity = Math.sqrt((ball.xvelocity*ball.xvelocity) + (ball.yvelocity*ball.yvelocity))
      let yvelocity = ballvelocity * Math.sin(bulletangle);
      let xvelocity = ballvelocity * Math.cos(bulletangle);

      let bullettime = dypred / (yvelocity * 60);
      let finaltime = Math.sqrt((btime - bullettime) * (btime - bullettime)) * 1000;
      setTimeout(() => {
        bullets.push(new Bullet(enemy.x, enemy.y, 10, "red", yvelocity, xvelocity))
      }, finaltime);
    }
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
    //change these to score function
    if (this.x - this.radius > cwidth) score(-1);
    if (this.x + this.radius < 0) score(1);
    //bounce
    if (this.y - this.radius < 0 || this.y + this.radius > cheight)
      this.yvelocity *= -1;

    this.draw();
  }
}

class Particle {
  constructor(x, y, radius, colour, yvelocity, xvelocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    this.yvelocity = yvelocity;
    this.xvelocity = xvelocity;
    this.alpha = 1;
  }
  draw() {
    ctx.save()
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  update() {
    this.x += this.xvelocity;
    this.y += this.yvelocity;
    this.draw();
  }
}

//global variables
let player = new Player(cwidth / 8, cheight / 2, 30, "blue", 0, 0);
let enemy = new Enemy((7 * cwidth) / 8, cheight / 2, 30, "red", 0, 0);
let ball = new Ball(cwidth / 2, cheight / 2, 30, "white", 0, 0, 2);
let bullets = [];
let particles = [];

//1 is left side, -1 is right
function score(side) {
  let x = ball.x;
  let y = ball.y;
  ball = 0;
  for(let i = 0; i < Math.random() * (30 - 10) + 10; i++) {
    let angle = side * (Math.random() * (Math.PI))
    let xvelocity = 30 * Math.cos(angle);
    let yvelocity = 30 * Math.sin(angle);
    particles.push(new Particle(x, y, 10, "white", yvelocity,xvelocity))
  }
  setTimeout(() => {
  ball = new Ball(cwidth / 2, cheight / 2, 30, "white", 0, 0, 2);
  }, 3000);
}

function animate() {
  //draw map
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
  bullets.forEach((bullet, index) => {
    bullet.update();
    if (
      this.x - this.radius > cwidth ||
      this.x + this.radius < 0 ||
      this.y + this.radius < 0 ||
      this.y - this.radius > cheight
    ) {
      bullets.splice(index, 1);
    }

    //collision detection bullet and ball
    let dx = bullet.x - ball.x;
    let dy = bullet.y - ball.y;
    let angle = Math.atan2(dy, dx);
    let dist = Math.hypot(dx, dy);
    if (dist - bullet.radius - ball.radius < 0) {
      ball.xvelocity = bullet.xvelocity;
      ball.yvelocity = bullet.yvelocity;
      enemy.predict()
      bullets.splice(index, 1);
    }
  });
  particles.forEach((particle, index) => {
    if(particle.alpha < 0.01) {
      particles.splice(index, 1);
    }
    particle.update();
  })
  if(ball != 0){
    ball.update();
  }
  player.update();
  enemy.update();
  requestAnimationFrame(animate);
}

//key detection
let dPressed = false;
let aPressed = false;
let wPressed = false;
let sPressed = false;
let canDash = true;

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
});

addEventListener("mousedown", (event) => {
  if (canshoot) {
    canshoot = false;
    setTimeout(() => {
      canshoot = true;
    }, 600);
    let dx = event.clientX - player.x;
    let dy = event.clientY - player.y;
    let angle = Math.atan2(dy, dx);
    let xvelocity = 20 * Math.cos(angle);
    let yvelocity = 20 * Math.sin(angle);
    player.shoot(xvelocity, yvelocity, 2);
  }
});

//once ball xvel is positive calculate ending position and move there
//once ball is stopped from player collision find furthest point from player and find an angle
//once enemy ai is on the same line of angle, shoot
//maybe add rebounding shots/ricoshet shots later on

animate();
