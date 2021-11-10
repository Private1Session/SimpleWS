const collision = {
	layers: {
		"default": [],
	},
	new: function(layer_name,parent,x,y) {
		const layers = this.layers;
		const map = layers[layer_name] || layers['default'];

		if (typeof map[x] === "undefined"){
			map[x] = [];
		}
		if (typeof map[y] === "undefined"){
			map[x][y] = [];
		}

		map[x][y] = parent;
	},

	remove: function(x,y){
		delete this.layers[x][y];
	},

	change: function(x1,y1,x2,y2){
		const map = this.layers;
		map[x2][y2] = map[x1][y1];
		
		delete map[x1][y1];
	},

	getAt: function(name,x,y){
		const map = this.layers;

		if (map.hasOwnProperty(name) === true){
			if (typeof map[name][x] !== 'undefined'){
				return map[name][x][y];
			}
		}
		//return this.layers['default'][x][y];
	},

	getlayer: function(name){
		const layers = this.layers;
		if ( layers.hasOwnProperty(name) === true ){
			return layers[name];
		}

		console.log('unable to find layer');
		return layers['default'];
	},

	newlayer: function(name){
		const layers = this.layers;

		// prevents it from overwritting layers
		if ( layers.hasOwnProperty(name) !== true ){
			layers[name] = [];
			return layers[name];
		}
		return false;
	}
};