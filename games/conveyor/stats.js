let spritesheet;
let selected_img;
const ter_size = {x:150,y:75};
const img_size = {x:150,y:150};
const direction = { // faces: [f]ront,[b]ack,[r]ight,[l]eft
	'f': [ 1, 0],
	'b': [-1, 0],
	'r': [ 0, 1],
	'l': [ 0,-1],
};

const stats = {
	Terrain: {
		"Grass": {
			Sprite: [0,0],
			CanBuildOntop: false,
		},
		"Solid": {
			Sprite: [1,0],
			CanBuildOntop: true,
		},
	},

	Drop: {
		"Basic": {
			Sprite: [0,3],
			Value: 10,
		}
	},

	Upgrader: {

	},

	Furnace: {
		"Basic-furn": {
			Sprite: [[2,2]],
			Multiplier: 1,
			Bonus: 5,
		}
	},

	Conveyor: {
		"Basic-Conv": {
			Sprite:[
				[0,2],
				[0,2],
				[1,2],
				[1,2]
			],
			MoveSpeed: 10,
		},
	},

	Spawner: {
		"Basic-Dropper": {
			Cooldown: 100,
			Sprite: [
				[3,2],
				[6,2],
				[5,2],
				[4,2]
			],

			DropItem: "Basic",
		}
	},
};
function preload(){
	console.log('test???')
	spritesheet = loadImage("spritessheet.png");
}

// Make loops look cleaner and shorter
function loop_object(object,callback){
	for (let key in object){
		if (!object.hasOwnProperty(key)) continue;
		callback(key,object[key]);
	}
}
function load_sprites() {
	// Loads the white tile border
	

	const imgx = img_size.x;
	const imgy = img_size.y;

	// loops through each class
	const ways = ['f','b','r','l']
	const get_sprite = function(data){
		const x = data[0] * imgx;
		const y = data[1] * imgy;

		return spritesheet.get(x,y,imgx,imgy);
	};

	selected_img = get_sprite([1,3]);
	loop_object(stats,function(cName,class_obj){

		// loops through each child inside class
		loop_object(class_obj,function(objName,obj){
			if (!obj.hasOwnProperty('Sprite')){return};
			console.log(objName);
			if (cName !== "Terrain" && cName !== "Drop"){
				obj.img = {};

				//for (let i = 0; i <)
				loop_object(obj.Sprite,function(i,v){
					obj.img[ways[i]] = get_sprite(v);
					console.log(ways[i])
				})
			} else {
				obj.img = get_sprite(obj.Sprite);
			}
		})
	})
}










