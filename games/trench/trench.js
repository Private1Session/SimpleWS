const trenches = [];

function findHighestYAxis(x) {
	for (let i = 0; i < trenches.length; i++){
		const trench = trenches[i];

		if (trench.x < x && trench.x + trench.width > x){
			return trenchDepth;
		}
	}
}

class structure {
	constructor(data) {
		for (const key of Object.keys(data)) {
			this[key] = data[key];
		}
		if (data.name === 'trench') {
			this.y = (-trenchDepth)
			this.width = trenchWidth;
			this.units = [];
			trenches.push(this)
		}
	}
}


class trench extends structure {
	constructor(pos_x,width){
		super({
			name: 'trench',
			x: pos_x
		})
	}
}