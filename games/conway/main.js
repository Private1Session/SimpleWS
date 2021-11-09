// SETTING UP EVENTS
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

let windowWidth;
let windowHeight;

let firstTime = true;
function resizeCanvas(){
	windowWidth = getWindowWidth();
	windowHeight = getWindowHeight();

	canvas.width  = windowWidth;
	canvas.height = windowHeight;

	if (firstTime === false) {
		windowResized();
	}
}
function getWindowWidth() {
	return (
		window.innerWidth ||
		(document.documentElement && document.documentElement.clientWidth) ||
		(document.body && document.body.clientWidth) ||
		0
	);
}

function getWindowHeight() {
	return (
		window.innerHeight ||
		(document.documentElement && document.documentElement.clientHeight) ||
		(document.body && document.body.clientHeight) ||
		0
	);
}

resizeCanvas();
window.addEventListener('resize',resizeCanvas);
window.addEventListener('orientationchange',resizeCanvas)
firstTime = false;


canvas.addEventListener('click', event => {
	let bound = canvas.getBoundingClientRect();

	let x = event.clientX - bound.left - canvas.clientLeft;
	let y = event.clientY - bound.top - canvas.clientTop;

	mousePressed(x,y);
});

const keypressed = [];
function keyRegistered(keycode){
	for (let i = 0; i < keypressed.length; i ++){
		if (keypressed[i] === keycode) {
			return true;
		}
	}
	return false;
}

let keydown;
window.addEventListener('keydown',event => {
	const keycode = event.keyCode;
	if (keyRegistered(keycode) === false) {
		keydown = event.keyCode;
		keypressed.push(keydown);
	}
});
window.addEventListener('keyup',event => {
	const keycode = event.keyCode;

	for (let i = 0; i < keypressed.length; i ++){
		if (keypressed[i] === keycode) {
			keypressed.splice(i,1);
			break;
		}
	}

	keydown = keypressed[0];
});




// SETUP RENDERING FUNCTIONS
function rect(mode,x,y,width,height){
	if (mode === 'fill') {
		context.fillRect(x,y,width,height);
	} else if (mode === 'line') {
		context.strokeRect(x,y,width,height);
	}
}
function translate(x,y){
	context.translate(x,y);
}

function setColor(value){
	context.fillStyle = value;
	context.strokeStyle = value;
}

function push(){
	context.save();
}
function pop(){
	context.restore();
}




/* ======= START OF GAME AREA ======= */
const tiles = [];
const help_tiles = [];

// COLOR VALUES
const c_f1 = '#c8c8c8'; // empty
const c_f2 = '#646464'; // occupied

const c_l1 = '#a8a8a8'; // empty outline
const c_l2 = '#555555'; // occupied outline

const emptyRows = 8;
const FPS = 20;

let tileSize = 40;
let tile_x;
let tile_y;
const camera = {
	speed: 13,
	x: 0,
	y: 0,

	mx: 0,
	my: 0,

	update: function(){
		if (keydown === 65 || keydown === 37) {
			this.x += this.speed;
		} else if (keydown === 68 || keydown === 39) {
			this.x -= this.speed;
		} else if (keydown === 83 || keydown === 40) {
			this.y -= this.speed;
		} else if (keydown === 87 || keydown === 38) {
			if (this.y + this.speed <= 0) {
				this.y +=  this.speed;
			} else {
				this.y = 0;
			}
		}

		
		this.mx = Math.floor(this.x / tileSize)*-tileSize;
		this.my = Math.floor(this.y / tileSize)*-tileSize;
	}
};

let topHeight;
let bottomHeight;
let redRowYAxis;
function tileResized(){
	topHeight = tileSize * emptyRows;
	bottomHeight = windowHeight - tileSize * emptyRows;
	redRowYAxis = (emptyRows - 5) * tileSize;
}


function windowResized(){
	tile_x = Math.floor(windowWidth / tileSize) + 1;
	tile_y = Math.floor(windowHeight / tileSize) + 1;
}


function getTileState(x,y){
	for (let i = 0; i < tiles.length; i++){
		const tile = tiles[i];
		if (tile.x === x && tile.y === y) {
			return y < emptyRows && 'full' || 'empty';
		}
	}

	return y < emptyRows && 'empty' || 'full';
}

function assignTileAs(x,y,newState) {
	const defaultState = (y < emptyRows && 'empty' || 'full');

	if (defaultState === newState) {
		for (let i = 0; i < tiles.length; i++) {
			const tile = tiles[i];

			if (tile.x === x && tile.y === y) {
				tiles.splice(i,1);
				break;
			}
		}
	} else {
		tiles.push({
			x: x,
			y: y,
			state: newState,
		});
	}
}


let selected = null;
function mousePressed(x,y){
	if (x > windowWidth - 100 && y < 50) {
		if (x > windowWidth - 50) {
			if (tileSize > 70) {
				return;
			}
			tileSize += 5;
			camera.x -= windowWidth / 17;
		} else if (tileSize > 20){
			tileSize -= 5;
			camera.x += windowWidth / 17;
		}
		
		windowResized();
		tileResized();
		return;
	}

	const gridX = Math.floor( (x - camera.x) / tileSize);
	const gridY = Math.floor( (y - camera.y) / tileSize);

	if (selected !== null) {
		if (selected.x === gridX && selected.y === gridY) {
			help_tiles.length = 0;
			selected = null;
			return;
		} else if (help_tiles.length > 0) {
			for (let i = 0; i < help_tiles.length; i++){
				const helpTile = help_tiles[i];
				if (helpTile.x === gridX && helpTile.y === gridY) {
					const tile0 = helpTile.nodes[0];
					const tile1 = helpTile.nodes[1];

					
					assignTileAs(tile0.x,tile0.y,'empty');
					assignTileAs(tile1.x,tile1.y,'empty');
					assignTileAs(gridX,gridY,'full');

					help_tiles.length = 0;
					selected = null;
					return;
				}
			}
		}
	}

	const directions = [
		{x: 1,y: 0},
		{x:-1,y: 0},
		{x: 0,y: 1},
		{x: 0,y:-1},
	];

	help_tiles.length = 0;
	const state = getTileState(gridX,gridY);
	if (state === 'full') {
		for (let i = 0; i < directions.length; i++) {
			const dir = directions[i];

			const tile1 = getTileState(gridX + dir.x, gridY + dir.y);
			const tile2 = getTileState(gridX + dir.x*2, gridY + dir.y*2);

			if (tile1 === 'full' && tile2 === 'empty') {
				help_tiles.push({
					x: gridX + dir.x * 2,
					y: gridY + dir.y * 2,
					state: tile2,

					nodes: [
						{x:gridX,y:gridY},
						{x:gridX + dir.x,y: gridY + dir.y}
					],
				});
			}
		}
	}

	selected = {
		x: gridX,
		y: gridY,
		state: state,
	};
}

tileResized();
windowResized();

function draw(){
	push();
	setColor(c_f2);
	rect('fill',0,0,windowWidth,windowHeight);

	camera.update();
	translate(0,camera.y);

	setColor(c_f1);
	rect('fill',0,0,windowWidth,topHeight);

	setColor('#c55'); // red color
	rect('fill',0,redRowYAxis,windowWidth,tileSize);

	translate(camera.x,0);

	push();
	translate(camera.mx,camera.my);
	for (let x = -1; x < tile_x; x++){ // draw grid
		for (let y = -1; y < tile_y; y++){
			let yAxis = y - Math.floor(camera.y/tileSize);
			if (yAxis === emptyRows - 5) {
				setColor('#b44');
			} else if (yAxis < emptyRows) {
				setColor(c_l1);
			} else {
				setColor(c_l2);
			}
			rect('line',x*tileSize,y*tileSize,tileSize,tileSize);
		}
	}
	pop();

	for (let i = 0; i < tiles.length; i++) {
		const tile = tiles[i];

		setColor(tile.state === 'empty' && c_f1 || c_f2);
		rect('fill',tile.x*tileSize,tile.y*tileSize,tileSize,tileSize);

		setColor(tile.state === 'empty' && c_l1 || c_l2);
		rect('line',tile.x*tileSize,tile.y*tileSize,tileSize,tileSize);
	}

	if (selected !== null) {
		setColor(selected.state === 'empty' && c_l1 || c_l2);
		rect('fill',selected.x*tileSize,selected.y*tileSize,tileSize,tileSize);
	}

	for (let i = 0; i < help_tiles.length; i++) {
		const tile = help_tiles[i];

		setColor('#5f5');
		rect('fill',tile.x*tileSize,tile.y*tileSize,tileSize,tileSize);

		setColor(tile.state === 'empty' && c_l2 || c_l1);
		rect('line',tile.x*tileSize,tile.y*tileSize,tileSize,tileSize);
	}

	pop();
	setColor('#444');

	context.font = "30px Arial";
	context.fillText("Conway's soldiers",5,30);
	context.fillText(windowWidth+','+windowHeight,5,70);

	translate(windowWidth,0);
	rect('fill',-45,20,40,10);
	rect('fill',-29,5,10,40);

	rect('fill',-95,20,40,10);	
}



/* ======= END OF GAME AREA ======= */

let then = Date.now();
let fpsInterval = 1000 / FPS;

function animate() {
	requestAnimationFrame(animate);

	let now = Date.now();
	let elapsed = now - then;

	if (elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);

		push();
		setColor('#000');
		context.clearRect(0,0,windowWidth,windowHeight);

		draw();
		pop();
	}
}

animate();