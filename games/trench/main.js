let teams = [];
let cash = 100;
const GAME_INTERFACE = new ScreenGui();

function setup(){
	teams = [
		{
			name: 'player',
			money: 100,
			color: color(100,125,200),
		},
		{
			name: 'computer',
			money: 100,
			color: color(100,100,100),
		}
	];

	loadCanvas();
	GAME_INTERFACE.importFrom(MAIN_GUI());

	camera.setup();
	SetupGUI();
}

function purchaseUnit(unit) {
	const baseStats = unit.stats
	const targetTeam = teams[0]

	if (baseStats.name === 'foot-soldier') {
		new infantry(targetTeam);

	} else if (baseStats.name === 'howitzer') {
		new artillery(targetTeam);

	} else if (baseStats.name === 'bomber') {
		new bomber(targetTeam);

	} else if (baseStats.name === 'fighter') {
		new fighter(targetTeam);

	} else if (baseStats.name === 'tank') {
		new tank(targetTeam);
	} 

	cash -= baseStats.price;
}

function mousePressed() {
	const x0 = mouseX;
	const y0 = mouseY;

	for (let i = 0; i < shop_buttons.length; i++) {
		const unit = shop_buttons[i];
		const x1 = unit.x;
		const y1 = unit.y;

		if (x1 < x0 && y1 < y0 && x1 + shop_tile_size > x0 && y1 + shop_tile_size > y0) {
			if (cash >= unit.stats.price) {
				purchaseUnit(unit);
			}
		}
	}
}

// HANDY FUNCTIONS:
// keyTyped()
// mousePressed()
// mouseDragged()
// mouseReleased()

let cooldown = 0
function draw(){
	if (cooldown <= 0) {
		new artillery(teams[1])
		cooldown = 100
	} else {
		cooldown--;
	}
	camera.update();
	clear();
	push();
	fill(125);
	rect(0, 0, windowWidth, windowHeight);


	noStroke();
	translate(0,windowHeight-terrainHeight);

	// Draws the map terrain
	fill(75,25,0) // brown color
	rect(0,0,windowWidth,terrainHeight)
	fill(50,100,0) // green color
	rect(0,0,windowWidth,grassHeight)
	fill(50,70,0) // darker green color
	rect(0,grassHeight,windowWidth,grassHeight)


	// Move with camera
	translate(halfWindow - camera.x,0)
	
	for (let i = 0; i < trenches.length; i++) {
		const trench = trenches[i];

		fill(125)
		rect(trench.x,0,trench.width,trenchDepth+10)
	
		fill(50,70,0) // darker green color
		rect(trench.x,trenchDepth+10,trench.width,10)
		rect(trench.x-10,20,10,trenchDepth)
		rect(trench.x+trench.width,20,10,trenchDepth)
	}

	particles.render();

	// Draw and updates entities
	for (let i = entities.length - 1; i >= 0; i--){
		const entity = entities[i];

		if (entity.dead === true) {
			entities.splice(i,1);
			continue;
		}
		
		
		entity.update();

		if (!isWithinWindow(entity.x)){
			continue;
		}
		
		push();
		translate(entity.x, entity.y - untiSize);

		if (entity.stats.offset !== undefined) {
			translate(
				entity.stats.offset[0],
				entity.stats.offset[1]
			);
		}

		if (entity.animation.image) {
			const team = entity.team
			tint(team.color)
			if (team.name === 'computer') {
				scale(-1,1);
			}
			image(entity.animation.image, -25, untiSize - 50)
		} else {
			fill(entity.team.color)
			stroke(0);
			rect(-untiSize/2,0,untiSize,untiSize)

			noStroke();
			fill(0);
			text(i,-13,10)
		}

		// Drawing healthbar
		const healthRemaining = entity.health / entity.stats.health;
		if (healthRemaining < 1) {
			stroke(100,100,100);
			translate(-healthWidth/2,-15)
			fill(200,0,0) // red color
			rect(0,0,healthWidth,5)

			fill(0,200,0) // green color
			rect(0,0,Math.floor(healthRemaining * healthWidth),5)
		}
		pop();
	}
	pop();
	GAME_INTERFACE.render();
	RenderShop();

	fill(255);
	textSize(20);
	text('Moneyz: ' + cash, 5, 25);
}