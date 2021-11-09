const particles = {
	contents: [],
	create: function(properties,callback){
		if (callback) {
			properties.completed = callback;
		}
		if (!properties.color) {
			properties.color = color(0,0,0);
		}
		this.contents.push(properties);
	},
	render: function(){
		const particles = this.contents;
		if (particles.length === 0) {
			return;
		}

		for (let i = particles.length - 1; i >= 0; i--){
			const part = particles[i]; // particle
			if (part.update) {
				part.update();
			}
			
			if (part.transparency) {
				part.color.setAlpha(part.transparency);
			}

			if (part.color) {
				fill(part.color);
			} else {
				fill(255);
			}
			
			if (part.shape === 'circle') {
				circle(part.x,part.y,part.radius);
			} else if (part.shape === 'line') {
				line();
			} else {
				rect(part.x,part.y,part.width,part.height);
			}

			if (part.lifetime === 0) {
				if (part.completed) {
					part.completed();
				}
				particles.splice(i,1);
				continue;
			}

			part.lifetime--;
		}
	}
};