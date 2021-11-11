const mapWidth = 3000;
const terrainHeight = 150;
const grassHeight = 10;
let skyboxHeight;


const renderOffsetX = 50;
let halfWindow;

const trenchWidth = 40;
const trenchDepth = 20;

const untiSize = 30
const healthWidth = 50;

function RandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RandomIntFrom(value,precent){
	return RandomInt(
		Math.floor(value * precent), 
		value
	);
}

let onGameLoadedCallbacks = [];
function onGameLoaded(callback) {
	onGameLoadedCallbacks.push(callback);
}
function onCanvasResize(){
	skyboxHeight = Math.max(windowHeight - terrainHeight,0);
	halfWindow = Math.floor(windowWidth/2);

	GAME_INTERFACE.windowResized();
}

function loadCanvas(){
	windowWidth = Math.min(windowWidth, 900)
	windowHeight = Math.min(windowHeight, 600) 
	createCanvas(windowWidth, windowHeight)
	
	const canvas = document.getElementById('defaultCanvas0');
	canvas.removeAttribute('style');
	/*
	window.addEventListener('resize',function(){
		canvas.width = windowWidth;
		canvas.height = windowHeight;		
		onCanvasResize();
	})
	*/

	onCanvasResize();

	//pixelDensity(1)
	frameRate(20);

	for (let i = 0;i < onGameLoadedCallbacks.length; i++){
		onGameLoadedCallbacks[i]();
	}
	onGameLoadedCallbacks = undefined;
}