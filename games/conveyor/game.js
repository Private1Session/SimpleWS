const tiles = [];
const machines = [];
const drops = [];
let unique_key = 0;
let player_money = 0;

class tile {
	constructor(name,x,z){
		this.name = name;
		this.position = new Vector3(x,0,z);

		this.stats = stats.Terrain[name];

		tiles.push(this);
		collision.new('terrain',this,x,z);
	}
}

// add this func plz: ScreenToWorldPoint
class conveyor { //extends tile{
	constructor(name,x,z,facing){
		//super(name);

		this.class = 'conveyor'
		this.dir = direction[facing];
		this.face = facing;
		this.position = new Vector3(x,25,z);
		this.stats = stats.Conveyor[name];

		machines.push(this);
		collision.new('machine',this,x,z);
	}

	status(bool){
		this.enabled = bool;
	}
}

class spawner extends conveyor {
	constructor(name,x,z,facing){
		super(name,x,z,facing);

		this.class = 'spawner';
		this.stats = stats.Spawner[name];
		this.cooldown = 0//this.stats.Cooldown;

		collision.new('machine',this,x,z);
		machines.push(this);
		console.log(this);
	}

	spawn_drop(){
		new drop(
			this.stats.DropItem,
			this.position.x,
			this.position.z
		);
	}

	update(){

		if (this.cooldown === 0){
			
			this.spawn_drop();
			this.cooldown = this.stats.Cooldown;
		} else {
			this.cooldown--;
		}
		//console.log(this.cooldown);
	}
}

class furnace {
	constructor(name,x,y){
		this.class = 'furnace';
		this.name = name;
		this.face = 'f';
		this.stats = stats.Furnace[name];
		this.position = new Vector3(x,25,y);

		machines.push(this);
		collision.new('machine',this,x,y);
	}
}

class drop {
	constructor(name,x,z){
		this.value = stats.Drop[name].Value;
		this.position = new Vector3(x,35,z);
		this.img = stats.Drop[name].img;
		this.moving = true;
		this.dir = [0,0];
		this.step = 0;
		this.id = unique_key++;

		drops.push(this);
	}

	destroy(){
		for (let i = 0; i < drops.length; i++){
			if (drops[i].id == this.id){
				drops.splice(i,1);
				break;
			}
		}
	}

	update(){
		
		if (this.step === 0) {
			const pos = this.position;
			const obj = collision.getAt('machine',pos.x,pos.z);


			if (typeof obj == 'undefined'){
				this.destroy();
			} else if (obj.class === 'furnace'){
				player_money += this.value * obj.stats.Multiplier + obj.stats.Bonus;
				this.destroy();
			} else {
				this.dir = obj.dir;
				this.step = 37;
				//console.log(pos.x,pos.z);
				//console.log(obj)
			}	
		}

		if (this.step > 0){
			const dir = this.dir;
			this.position.increase(dir[0],0,dir[1]);
			this.step--;
			//console.log(this.position.step.x);
		}
		
		//console.log(this.position.step.x);
	}
}