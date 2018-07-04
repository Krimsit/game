var game = document.getElementById('game');
var map = game.getContext('2d');

var pl = document.getElementById('player');
var ctxPl = pl.getContext('2d');

var enemyCanv = document.getElementById('enemy');
var ctxEn = enemyCanv.getContext('2d');

var stats = document.getElementById('stats');
var ctxStats = stats.getContext('2d');

var times = document.getElementById('times');
var ctxTimes = times.getContext('2d');

var gameover = document.getElementById('gameover');
var ctxGameOver = gameover.getContext('2d');

var gameWidth = 1200;
var gameHeight = 500;

var bg = new Image();
bg.src = 'app/../image/background.png';

var tiles = new Image();
tiles.src = 'app/../image/gg.png';

var en = new Image();
en.src = 'app/../image/enemy.png';

var enemy = [];

var player = new Player();

var health = 100;

var hour = 0;
var minuts = 0;
var second = 0;
var millisecond = 0;
var millisec = 0;

var isPlaying;

window.onload = function(){
	game.width = gameWidth;
	game.height = gameHeight;
	pl.width = gameWidth;
	pl.height = gameHeight;
	enemyCanv.width = gameWidth;
	enemyCanv.height = gameHeight;
	stats.width = gameWidth;
	stats.height = gameHeight;
	times.width = gameWidth;
	times.height = gameHeight;
	gameover.width = gameWidth;
	gameover.height = gameHeight;

	ctxStats.fillStyle = '#fff';
	ctxStats.font = 'bold 20pt Arial';
	ctxTimes.fillStyle = '#fff';
	ctxTimes.font = 'bold 20pt Arial';
	ctxGameOver.fillStyle = '#ff0000';
	ctxGameOver.font = 'bold 60pt Arial';

	startLoop();

	document.addEventListener("keydown", checkKeyDown, false);
	document.addEventListener("keyup", checkKeyUp, false);
}

//Игрок
function Player(){
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = 0;
	this.drawY = 200;
	this.width = 191;
	this.height = 121;

	this.isUp = false;
	this.isDown = false;
	this.isRight = false;
	this.isLeft = false;

	this.speed = 8;
};

Player.prototype.draw = function(){
	ctxPl.clearRect(0, 0, gameWidth, gameHeight);
	ctxPl.drawImage(tiles, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

Player.prototype.update = function(){
	this.chooseDir();
	if(this.drawX < 0)
		this.drawX = 0;
	if(this.drawX > gameWidth - this.width)
		this.drawX = gameWidth - this.width;
	if(this.drawY < 0)
		this.drawY = 0;
	if(this.drawY > gameHeight - this.height)
		this.drawY = gameHeight - this.height;

	for(var i = 0; i < enemy.length; i++){
		if(this.drawX >= enemy[i].drawX && this.drawY >= enemy[i].drawY && this.drawX <= enemy[i].drawX + enemy[i].width && this.drawY <= enemy[i].drawY + enemy[i].height){
			health--;
		}
		if(health == 0){
			stopLoop();
			map.clearRect(0, 0, gameWidth, gameHeight);
			ctxPl.clearRect(0, 0, gameWidth, gameHeight);
			ctxEn.clearRect(0, 0, gameWidth, gameHeight);
			ctxStats.clearRect(0, 0, gameWidth, gameHeight);
			ctxGameOver.fillText('GAME OVER', 350 ,250);
		}
	}
};

Player.prototype.chooseDir = function(){
	if(this.isUp){
		this.drawY -= this.speed;
	}
	if(this.isDown){
		this.drawY += this.speed;
	}
	if(this.isRight){
		this.drawX += this.speed;
	}
	if(this.isLeft){
		this.drawX -= this.speed;
	}
}

//Враг
var spawnInterval;
var spawnAmount = 6;

function Enemy(){
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = Math.floor(Math.random()*gameWidth)+gameWidth;
	this.drawY = Math.floor(Math.random() * gameHeight);
	this.width = 128;
	this.height = 128;
	this.speed = 3;

	this.speed = 10;
};

Enemy.prototype.draw = function(){
	ctxEn.drawImage(en, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

Enemy.prototype.update = function(){	
	this.drawX -= 10;
	if(this.drawX + this.width < 0){
		this.destroy();
	}
};

Enemy.prototype.destroy = function(){
	enemy.splice(enemy.indexOf(this), 1);
}

function spawnEnemy(count){
	for(var i = 0; i < count; i++){
		enemy[i] = new Enemy();
	}
}

function startCreating(){
	stopCreating();
	spawnInterval = setInterval(function(){
		spawnEnemy(spawnAmount);
	},5000);
}

function stopCreating(){
	clearInterval(spawnInterval);
}

//Рисование фона
function drawBg(){
	map.drawImage(bg, 0, 0, 800, 480, 0, 0, gameWidth, gameHeight);
}

//Цикл игры и отображение
function loop(){
	if(isPlaying){
		draw();
		update();
		requestAnimationFrame(loop);
	}
}

function startLoop(){
	isPlaying = true;
	loop();
	startCreating();
}

function stopLoop(){
	isPlaying = false;
}

function draw(){
	player.draw();
	clearEnemy();
	for(var i = 0; i < enemy.length; i++){
		enemy[i].draw();
	}
}

function update(){
	player.update();
	for(var i = 0; i < enemy.length; i++){
		enemy[i].update();
	}
	updateStats();
	Times();
	drawBg();
}

function clearEnemy(){
	ctxEn.clearRect(0, 0, gameWidth, gameHeight);
}

function updateStats(){
	ctxStats.clearRect(0, 0, gameWidth, gameHeight);
	ctxStats.fillText('Health: ' + health, 10, 25);
}

function Times(){
	ctxTimes.clearRect(0, 0, gameWidth, gameHeight);
	sec();
	ctxTimes.fillText(minuts + ': ' + second + ': ' + millisecond, 10, 495);
}
function sec(){
	millisec += 100;
	if(millisec >= 1000){
  	millisecond++;
  	if(millisecond >= 60){
  		millisecond = 0;
  		second++;
  		if(second >= 60){
  			second = 0;
  			minuts++;
  		}
  	}
  }
}

//Управление
function checkKeyDown(e){
	if(e.keyCode == 87){
		player.isUp = true;
		e.preventDefault();
	}
	if(e.keyCode == 83){
		player.isDown = true;
		e.preventDefault();
	}
	if(e.keyCode == 68){
		player.isRight = true;
		e.preventDefault();
	}
	if(e.keyCode == 65){
		player.isLeft = true;
		e.preventDefault();
	}
}
function checkKeyUp(e){
	if(e.keyCode == 87){
		player.isUp = false;
		e.preventDefault();
	}
	if(e.keyCode == 83){
		player.isDown = false;
		e.preventDefault();
	}
	if(e.keyCode == 68){
		player.isRight = false;
		e.preventDefault();
	}
	if(e.keyCode == 65){
		player.isLeft = false;
		e.preventDefault();
	}
}