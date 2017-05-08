var started = false;

var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;
var FPS = 30;
var canvasElement = $("<canvas class='gameZoom' width='" + CANVAS_WIDTH +                       "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
//var normal = 3;
var speed = 3;
var accel = 2;

var score =  0;
var lives_max = 3;
var lives = lives_max;

var game = true;

var textX = 50;
var textY = 50;

var player = {
  x: 220,
  y: 270,
  width: 32,
  height: 32,
  draw: function() {
    this.sprite.draw(canvas, this.x, this.y);
  }
};

var playerBullets = [];
var enemies = [];

function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function gameover(){
	game = false;
}
function stats(){
	var live = ("×".repeat(lives_max - lives))+("♥".repeat(lives));
	canvas.font = "bold 20pt monospace";
	canvas.fillStyle = "#888";
	canvas.fillText(score, 5, CANVAS_HEIGHT-5);
	canvas.fillText(live, CANVAS_WIDTH-(live.length*15+5), CANVAS_HEIGHT-5);
}
function message(message, sub){
	canvas.fillStyle = "rgba(255, 255, 255, 0.75)";
	canvas.fillRect(0, CANVAS_HEIGHT/3, CANVAS_WIDTH, CANVAS_HEIGHT/3);
	canvas.fillStyle = "#888";
	canvas.font = "bold 40pt monospace";
	canvas.fillText(message, (CANVAS_WIDTH-(30*message.length))/2, CANVAS_HEIGHT/2);
	canvas.font = "bold 20pt monospace";
	canvas.fillText(sub, (CANVAS_WIDTH-(15*sub.length))/2, CANVAS_HEIGHT/2+40);
}

function Enemy(I) {
  I = I || {};

  I.active = true;
  I.age = Math.floor(Math.random() * 128);

  I.sprite = Sprite("asteroid");

  I.x = CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
  I.y = 0;
  I.xVelocity = 0
  I.yVelocity = 2;

  I.width = 32;
  I.height = 32;

  I.inBounds = function() {
    return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
  };

  I.draw = function() {
    this.sprite.draw(canvas, this.x, this.y);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

    I.age++;

    I.active = I.active && I.inBounds();
  };

  I.explode = function() {
	  Sound.play("explode");
	  this.active = false;
	//if(game){score++;}
    // Дополнительно: Добавляем графику для взрыва
  };

  return I;
};

function Bullet(I) {
  I.active = true;

  I.xVelocity = 0;
  I.yVelocity = -I.speed;
  I.width = 2;
  I.height = 3;
  I.color = "#888";

  I.inBounds = function() {
    return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
  };

  I.draw = function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.active = I.active && I.inBounds();
  };

  return I;
}

function handleCollisions() {
  playerBullets.forEach(function(bullet) {
    enemies.forEach(function(enemy) {
      if (collides(bullet, enemy)) {
        enemy.explode();
        bullet.active = false;
		score++;
      }
    });
  });

  enemies.forEach(function(enemy) {
    if (collides(enemy, player)) {
		player.explode();
		enemy.explode();
    }
  });
}

function update() {
if(game){
  if (keydown.space) {
    player.shoot();
  }

/* if(keydown.shift){
	 if(speed==normal){
		speed = normal+accel;
	 }else{
		speed = normal;
	 }
}*/
  
  if (keydown.left) {
    player.x -= speed;
	 if(keydown.shift){
		 player.x -= accel;
	 }
  }

  if (keydown.right) {
    player.x += speed;
	if(keydown.shift){
		 player.x += accel;
	 }
  }
  
  if (keydown.up) {
    player.y -= speed;
	if(keydown.shift){
		 player.y -= accel;
	 }
  }

  if (keydown.down) {
    player.y += speed;
	if(keydown.shift){
		 player.y += accel;
	 }
  }

  player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);
  player.y = player.y.clamp(0, CANVAS_HEIGHT - player.height);
  
  
  
  playerBullets.forEach(function(bullet) {
    bullet.update();
  });

  playerBullets = playerBullets.filter(function(bullet) {
    return bullet.active;
  });
  
  
  
  enemies.forEach(function(enemy) {
    enemy.update();
  });

  enemies = enemies.filter(function(enemy) {
    return enemy.active;
  });

  if(Math.random() < 0.1) {
    enemies.push(Enemy());
  }
  
  handleCollisions();
}else{
	if(keydown.return){
		game=true;
		score = Math.round(score/2-0.1);
		lives = lives_max;
	}
}
}

player.sprite = Sprite("corvette");

player.shoot = function() {
  var bulletPosition = this.midpoint();
  Sound.play("shoot");
  playerBullets.push(Bullet({
    speed: 5,
    x: bulletPosition.x - 1,
    y: bulletPosition.y
  }));
};

player.explode = function() {
	if(lives>0){
		lives--;
	}
	if(lives==0){
		this.active = false;
		gameover();
		Sound.play("gameover");
	}
};

player.midpoint = function() {
  return {
    x: this.x + this.width/2,
    y: this.y + this.height/2
  };
};

function draw() {
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  player.draw();
  
  playerBullets.forEach(function(bullet) {
    bullet.draw();
  });
  
  enemies.forEach(function(enemy) {
    enemy.draw();
  });
  stats();
  if(!game){
	  message("Game Over!", "> Press 'ENTER' to continue");
  }
}
$(document).bind("keydown.return", function() {
	if(!started){
		canvasElement.prependTo('.wrapper');
		$("<div class='hint'>Управление: <b class='control'>↑</b>, <b class='control'>↓</b>, <b class='control'>←</b> ,<b class='control'>→</b>, <b class='control'>Space</b>, <b class='control'>Shift</b></div>").appendTo(".wrapper");
		setInterval(function() {
			update();
			draw();
		}, 1000/FPS);
	}
	started = true;
});