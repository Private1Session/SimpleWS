function isWithinWindow(x) {
	if (halfWindow - camera.x - renderOffsetX < x && 
		camera.x + halfWindow +renderOffsetX > x) {
		return true;
	} else {
		return false;
	}
}

const camera = {
	x: 0,
	y: 0,

	speed: 10,

	setup: function(){
		this.x = Math.floor(windowWidth/2);
	},

	update: function() {

		if (mouseX > windowWidth-100 && this.x + windowWidth/2 < mapWidth){
			this.x += this.speed;

		} else if (mouseX < 100 && this.x - windowWidth/2 > 0){
			this.x -= this.speed;
		}
	},
}