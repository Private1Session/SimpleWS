let stats = []

function preload(){
	stats = [
		{
			classname: 'infantry',
			name: 'foot-soldier',

			price: 2,

			cooldown: 10,
			mobility: 5,
			range: 200,
			health: 20,
			damage: 4,

			sprites: {
				'moving': {
					frameCooldown: 1,
					frames: [
						loadImage('images/foot-soldier/move-1.png'),
						loadImage('images/foot-soldier/move-2.png'),
						loadImage('images/foot-soldier/move-3.png'),
						loadImage('images/foot-soldier/move-4.png'),
						loadImage('images/foot-soldier/move-5.png'),
					],
				},

				'attack': {
					frameCooldown: 1,
					frames: [
						loadImage('images/foot-soldier/attack-1.png'),
						loadImage('images/foot-soldier/attack-2.png'),
						loadImage('images/foot-soldier/attack-3.png'),
						loadImage('images/foot-soldier/attack-4.png'),
					],
				}
			}
		},

		{
			classname: 'artillery',
			name: 'howitzer',

			price: 7,

			cooldown: 300,
			mobility: 3,
			range: 1000,
			health: 15,
			damage: 15,

			blastRadius: 30,
			maxHits: 3,

			sprites: {
				'moving': {
					frameCooldown: 1,
					frames: [
						loadImage('images/howitzer/moving-1.png'),
						loadImage('images/howitzer/moving-2.png')
					],
				},
			}
		},
		{
			classname: 'airplane',
			name: 'bomber',

			price: 10,

			health: 30,
			mobility: 6,

			offset: [0,-5],

			cooldown: 100,
			range: 300,
			damage: 25,

			bomb: {
				fallSpeed: 10,
				speedX: 4,
			},

			targetFilter: [
				{
					name: 'notTargetClass',
					value: 'airplane'
				}
			],

			blastRadius: 35,
			maxHits: 3,

			sprites: {
				'moving': {
					frameCooldown: 2,
					frames: [
						loadImage('images/bomber/move-1.png'),
						loadImage('images/bomber/move-2.png'),
						loadImage('images/bomber/move-3.png'),
						loadImage('images/bomber/move-4.png'),
						loadImage('images/bomber/move-5.png'),
						loadImage('images/bomber/move-6.png'),
					],
				},
				'attack': {
					frameCooldown: 2,
					frames: [
						loadImage('images/bomber/attack-1.png'),
						loadImage('images/bomber/attack-2.png'),
						loadImage('images/bomber/attack-3.png'),
						loadImage('images/bomber/attack-4.png'),
						loadImage('images/bomber/attack-6.png'),
					],
				}
			},		
		},

		{
			classname: 'airplane',
			name: 'fighter',

			price: 8,

			health: 30,
			mobility: 8,

			cooldown: 4,
			range: 200,
			damage: 3,
			viewRange: 700,

			targetFilter: [
				{
					name: 'filterByClass',
					value: 'airplane'
				}
			],

			sprites: {
				'moving': {
					frameCooldown: 2,
					frames: [
						loadImage('images/fighter/move-1.png'),
						loadImage('images/fighter/move-2.png'),
						loadImage('images/fighter/move-3.png'),
						loadImage('images/fighter/move-4.png'),
					],
				},

				'attack': {
					frameCooldown: 2,
					frames: [
						loadImage('images/fighter/attack-1.png'),
						loadImage('images/fighter/attack-2.png'),
						/*
						loadImage('images/fighter/firing-2.png'),
						loadImage('images/fighter/firing-3.png'),
						loadImage('images/fighter/firing-4.png'),
						loadImage('images/fighter/firing-5.png'),
						*/
					],
				}
			},		
		},

		{
			classname: 'vehicle',
			name: 'tank',

			price: 10,
			offset: [10, 0],

			cooldown: 50,
			mobility: 3,
			range: 200,
			health: 150,
			damage: 15,

			sprites: {
				'moving': {
					frameCooldown: 2,
					frames: [
						loadImage('images/tank/move-1.png'),
						loadImage('images/tank/move-2.png'),
					],
				},

				'attack': {
					frameCooldown: 1,
					frames: [
						loadImage('images/tank/attack-1.png'),
						loadImage('images/tank/attack-2.png'),
						loadImage('images/tank/attack-3.png'),
						loadImage('images/tank/attack-1.png'),
					],
				},
			}
		},
	]
}
	