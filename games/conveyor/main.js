function setup(){
	const Canvas = createCanvas(750,500)
	frameRate(20);
	load_sprites();

	collision.newlayer('terrain');
	collision.newlayer('machine');


	new spawner("Basic-Dropper",1,2,"l");
	//new drop("Basic",1,1);
	for (let x = 1; x < 5; x++){
		new conveyor("Basic-Conv",x,1,'f')
	}
	for (let y = 1; y < 5; y++){
		new conveyor("Basic-Conv",5,y,'r')
	}
	for (let x = 0; x <= 10; x++){
		for (let y = 0; y <= 10; y++){
			let type = random(["Grass"]);
			new tile(type,x,y);
		}
	}
	new furnace('Basic-furn',5,5)

}

let tile_clicked = {x:0,y:0};
function mousePressed(){
	camera.Pressed();

	const mx = mouseX;
	const my = mouseY;

	const grid = Vector2.ScreenToWorldGrid(mx,my);
	const pos = Vector2.GridToWorldPoint(grid.x,0,grid.y);

	const item = collision.getAt('terrain',grid.x,grid.y);

	tile_clicked = {
		x: grid.x,
		y: grid.y,

		sx: pos.x,
		sy: pos.y,
		hidden: false,
	};

	if (typeof item === 'undefined'){
		tile_clicked.hidden = true;
	}
}

function mouseDragged(){
	camera.Dragged();
}

function mouseReleased(){
	camera.Released();
}

function draw(){
	//update();
	clear();
	background(0);

	translate(camera.x,camera.y)

	fill(255); // Draw terrain
	for (let i = 0; i < tiles.length; ++i){
		let tile = tiles[i];
		image(
			tile.stats.img,
			tile.position.ax,
			tile.position.ay
		);
	}

	if (tile_clicked.hidden === false){
		image(
			selected_img,
			tile_clicked.sx,
			tile_clicked.sy
		);
	}
	

	for (let i = 0; i < machines.length; ++i){
		let mach = machines[i];

		if (mach.update){
			mach.update();
		}

		image(
			mach.stats.img[mach.face],
			mach.position.ax,
			mach.position.ay
		)
	}

	for (let i = drops.length-1; i >= 0; i--){
		let item = drops[i];
		item.update();
		image(
			item.img,
			item.position.ax,
			item.position.ay
		)
	}

	translate(-camera.x,-camera.y);

	// button to open shop!
	rect(0,500-50,50,50)

	// shop store
	rect(0,500-300,200,300)

	textSize(15)
	text('your moneyz: ' + player_money,10,20)

	//fill(255);
	//text((click.x + "," + click.y),10,15);
}