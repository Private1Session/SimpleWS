const Vector2 = {
	ScreenToWorldGrid: function(mx,my){
		const w = 150;
		const h = 75;

		const x = (mx - camera.x) / w;
		const y = (my - camera.y) / h;

		return {
			// In grid format ^^
			x: Math.round(x + y) - 1,
			y: Math.round(y - x)
		};
	},
	GridToWorldPoint: function(x,y,z){
		x--;
		z--;

		const w = ter_size.x;
		const h = ter_size.y;

		const tx = Math.floor(w/2 - 1);
		const ty = Math.floor(h/2);

		return {
			x: x*tx + -z*tx,
			y: x*ty + z*ty - y - 1
		};
	}
}

class Vector3 { // does all the math
	constructor(x,y,z) {
		const w = ter_size.x;
		const h = ter_size.y;

		const tx = Math.floor(w/2 - 1);
		const ty = Math.floor(h/2);

		// Relative to ingame
		this.step = {x:0,y:0};
		this.x = x;
		this.y = y;
		this.z = z;

		// Absolute values
		this.ax = x*tx + -z*tx;
		this.ay = x*ty + z*ty - y - 50;
	}

	increase(x,y,z){
		// 150 75;
		// Tile width relative ingame 75-75
		const stepx = this.step.x + x;
		const stepy = this.step.y + z;

		//console.log(stepx,stepy);

		if (stepx >= 37){
			this.x++;
			this.step.x = 0;
		} else if (stepx <= -37) {
			this.x--;
			this.step.x = 0;
		} else {
			this.step.x = stepx;
		}

		if (stepy >= 37){
			this.z++;
			this.step.y = 0;
		} else if(stepy <= -37) {
			this.z--;
			this.step.y = 0;
		} else {
			this.step.y = stepy;
		}

		this.y += y;
		this.ax += (x - z)*2;
		this.ay += x + z - y;
	}

	lerp(){
		
	}

	magnitude(){

	}
}

/* CLASS EXAMPLE
class Hero {
    constructor(name, level) {
        this.name = name;
        this.level = level;
    }

    // Adding a method to the constructor
    greet() {
        return `${this.name} says hello.`;
    }
}
*/