class UDim2 {
	constructor(sx,ox,sy,oy) {
		sx = sx || 0;
		ox = ox || 0;
		sy = sy || 0;
		oy = oy || 0;

		this.offset = [ox,oy];
		this.scale = [sx,sy];
		
		this.recalculate();
	}

	recalculate() {
		this.x = this.scale[0] * windowWidth  + this.offset[0];
		this.y = this.scale[1] * windowHeight + this.offset[1];

		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
	}
}

let DEFAULT_UI_PROPERTIES = {};

onGameLoaded(() => {
	DEFAULT_UI_PROPERTIES = {
		'rect': {
			position: new UDim2(),
			size: new UDim2(),
		},

		'text': {
			position: new UDim2(),
			size: new UDim2(),

			font: 'Courier new',
		},

		'circle': {
			position: new UDim2(),

			radius: 1,
		},
	};
})

const createUIObject = {
	text: function(properties){
		properties.y += properties.height/2;
	},

	customInit(name) {
		if (this[name]) {
			this.name();
		}
	}
};


class ScreenGui {
	constructor() {
		this.children = [];
	}

	render() {
		let isHovering = false;
		for (let i = this.children.length - 1; i >= 0; i--){
			const frame = this.children[i];
			const x = frame.position.x;
			const y = frame.position.y;
			const width = frame.size.x;
			const height = frame.size.y;

			if (frame.color) {
				fill(part.color);
			} else {
				fill(255);
			}

			if (frame.name === 'button' && isHovering === false) {
				if (mouseX > x && mouseX < x + width &&
					mouseY > y && mouseY < y + height) {
					fill(frame.hoverColor);
					isHovering = true;
				}
			}

			if (frame.name === 'rect') {
				rect(x,y,width,height);
			} else if (frame.name === 'text') {
				textSize(height);
				textFont(frame.font);
				textAlign(CENTER,CENTER);

				text(frame.text,x,y,width);				
			} else if (frame.name === 'circle') {
				circle(x,y,frame.radius);
			}
		}
	}

	create(name,properties) {
		createUIObject.customInit(name);
		const newObj = Object.assign(DEFAULT_UI_PROPERTIES[name],properties);
		newObj.name = name;
		this.children.push(newObj);
	}

	importFrom(data) {
		for (let i = 0; i < data.length; i++){
			const obj = data[i];
			this.create(obj.name, obj);
		}
	}

	windowResized() {
		for (let i = 0; i < this.children.length; i++) {
			const obj = this.children[i];
			if (obj.position) {
				obj.position.recalculate();
			}
			if (obj.size) {
				obj.size.recalculate();
			}
		}
	}
}