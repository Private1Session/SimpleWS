function MAIN_GUI(){
	return [
		{
			name: 'rect',
			position: new UDim2(0,0,0.9,0),
			size: new UDim2(1,0,0.1,0),
		},
		{
			parent: 0,
			name: 'rect',
			position: new UDim2(0.2,0,0.9,0),
			size: new UDim2(1-0.4,0,0.1,0),
		},
	];
}

const shop_tile_size = 50;
const shop_buttons = [];
function SetupGUI()	{
	for (let i = 0; i < stats.length; i++) {
		const data = stats[i];

		const x = Math.floor((i - stats.length/2) * shop_tile_size * 2 + windowWidth/2)
		const y = windowHeight - shop_tile_size - 25

		shop_buttons.push({
			x: x,
			y: y,

			stats: data,
		})
		console.log(x, y);
	}

	
}


function RenderShop(){
	stroke(0);
	textSize(20);

	for (let i = 0; i < shop_buttons.length; i++) {
		const v = shop_buttons[i];
		const data = v.stats;

		fill(255);
		rect(v.x, v.y, shop_tile_size, shop_tile_size);
		image(data.sprites['moving'].frames[0], v.x, v.y);

		fill(0);
		text(data.price, v.x + 2, v.y + 17);
	}
}
