var score = 0;
var highscore = 0; // saves using cookies!
var gameEnded = false;
var game_running = false;

var canvWidth;
var canvHeight;
var fullHeight;

var halfWidth;
var halfHeight;


function ResetGame(){
	wall.content = [];

	wall.new();
	wall.speed = 3;

	bird.y = halfHeight;
	bird.gravity = 0;

	score = 0;
	gameEnded = false;
	game_running = false;
	
	game.alpha = 0;
	game.newColor = null;
	game.backgroundColor = color(200,200,255);
}

function GameOver(){
	gameEnded = true
	if (score > highscore){
		//const cookie = document.cookie.split(';');


		// Clears all previous cookies
		/*
		for (let i = 0; i < cookie.length; i++) {
			const chip = cookie[i],
			entry = chip.split("="),name = entry[0];
			//document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
		document.cookie = '{"highscore":' + score + '}';
		*/
		highscore = score;
	}
}

function setup(){
	canvWidth = Math.min(1000, windowWidth);
	canvHeight = windowHeight - 75
	fullHeight = canvHeight;

	halfWidth = Math.floor(canvWidth/2);
	halfHeight = Math.floor(fullHeight/2);

	/*
	if (document.cookie === ''){
		document.cookie = '{"highscore":0}';
	}
	highscore = JSON.parse(document.cookie).highscore;
	*/

	createCanvas(canvWidth, canvHeight);
	frameRate(30);

	ResetGame();
}

const game = {
	effects: [],

	alpha: 0,
	newColor: null,
	bgColor: null,

	updateColor: function(r,g,b){
		this.newColor = color(r,g,b);
		this.alpha = 1;
	},
	update: function(){
		if (this.alpha > 0){
			const from = this.backgroundColor;
			const to = this.newColor;
			this.alpha -= 0.01;
			this.backgroundColor = lerpColor(from,to,1-this.alpha)

			if (this.alpha <= 0){
				this.newColor = null;
			} 
		}
	},

	fixed_colors: [
		[100,100,150],
	],
}

const bird = {
	x: 100,
	y: 0,

	angle: 0,
	radius: 10,
	gravity: 0,
		
	update: function(){
		if (this.gravity > -14){
			this.gravity -= 1;
		}

		if (this.y < canvHeight){
			this.y -= Math.floor(this.gravity);
		} else {
			this.y = canvHeight
			GameOver();
		}
	},

	draw: function(){
		fill(200,50,50);
		circle(this.x,this.y,this.radius);
	},

	jump: function(){
		if (this.y >= 0){
			this.gravity = 15;
		}
	}
};

const wall = {
	content: [],

	width: 50,
	speed: 2,
	spaceBetweenWall: 200,

	new: function(){
		const prevPillar = this.content[this.content.length-1];
		

		const space = this.spaceBetweenWall
		const height = Math.round(random(1,canvHeight - space*2))
		const content = this.content;
		const data = {
			touched: false,
			width: this.width,
			x: canvWidth,
			y: -1,

			sy: height + space + 1,
			height1: height, // first pillar
			height2: canvHeight - (height + space), // second pillar
		}

		// collision related grabage
		data.cy = data.sy - space - 2;
		data.space = space + 2;

		this.content.push(data)
	},
	update: function(){
		const walls = this.content;

		// Draws walls
		for (let i = walls.length-1; i >= 0; --i){
			const v = walls[i];
			const wh = this.width;

			rect(v.x,v.y, wh,v.height1);
			rect(v.x,v.sy,wh,v.height2);

			fill(150);

			if (bird.y < canvHeight){
				v.x -= this.speed;
			}

			if (v.x <= -this.width) {
				this.content.splice(i,1);
			}
		}


		if (gameEnded === true){
			return
		}

		if (walls[walls.length-1].x < canvWidth - 300){
			this.new();
		}
	},
	isCollidingWithBird: function(){
		if (this.content.length === 0){return false};
		const wall = this.content[0];

		if (bird.x >= wall.x && bird.x <= wall.x + wall.width){
			if (bird.y >= wall.cy && bird.y <= (wall.cy + wall.space) ){
				if (wall.touched === false && gameEnded === false){
					score++;
					wall.touched = true

					if (score % 5 === 0){
						this.speed = Math.min(++this.speed,16)
						this.cooldown = Math.max(this.cooldown-10,25);
					}
					if (score % 15 === 0){
						game.updateColor(random(255),random(255),random(255));
					}
				}
				return false
			}
			return true
		}
	}
};

function onJump() {
	if (gameEnded === true){
		ResetGame();
	} else {
		bird.jump();
		game_running = true;
	}
}


function keyPressed(){
	onJump();
}
function touchStarted(){
	onJump();
}


function draw() {
	clear();

	noStroke();
	fill(game.backgroundColor)
	rect(0,0,canvWidth,fullHeight);

	game.update();

	if (game_running === true){
		bird.update();

		// draw background

		stroke(0)
		fill(150);
		wall.update();

		if (wall.isCollidingWithBird() === true){
			GameOver();
		}

	} else {
		stroke(0);
		fill(0);
		textSize(25);
		textAlign(CENTER);
		text('Press any key to start jumping',halfWidth,halfHeight);
		textAlign(LEFT);
		
	}
	bird.draw();
	

	fill(100,200,100)
	rect(0,fullHeight-30,canvWidth,30)

	fill(50)
	textSize(20)
	strokeWeight(2);
	if (score > highscore){
		text("Score: " + score,10,25)
		text("Highscore: " + highscore,10,50)
	} else {
		text("Highscore: " + highscore,10,25)
		text("Score: " + score,10,50)
	}

	if (gameEnded === true){
		fill(25,25,25,100)
		rect(0,0,canvWidth,fullHeight);

		translate(halfWidth,halfHeight)
		textAlign(CENTER)
		textSize(50)
		fill(0,0,0)
		text("Game over ",0,0)

		textSize(25)
		text("Press any key to play again",0,40)
	}
	textAlign(LEFT)
}