const camera = {
	x: 0,
	y: 0,

	sx: 0,
	sy: 0,

	startx: 0,
	starty: 0,

	diffx: 0,
	diffy: 0,

	Pressed: function(){
		this.startx = mouseX;
		this.starty = mouseY;
	},

	Dragged: function(){ // mouse position
		const mx = mouseX;
		const my = mouseY;

		this.diffx = this.startx - mx;
		this.diffy = this.starty - my;

		this.x = this.sx - this.diffx;
		this.y = this.sy - this.diffy;
	},

	Released: function(){
		this.sx -= this.diffx;
		this.sy -= this.diffy;

		this.diffx = 0;
		this.diffy = 0;
	},
};