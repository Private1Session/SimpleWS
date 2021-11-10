const entities = [];
const projectiles = [];

const filterFunc = {
	default: function(source,target,fireRange){
		if (target.stats.classname === 'airplane'){
			if (source.stats.classname !== 'airplane'){
				return false;
			}
		}

		if (target.team.name !== source.team.name){
			let min_range = source.x
			let max_range = min_range + fireRange
			if (source.team.name !== 'player') {
				min_range = min_range - fireRange
				max_range = source.x
			}

			if (min_range < target.x && max_range > target.x) {
				return true;
			}
		}
	},

	minRange: function(source,target,min){
		const dist = Math.abs(source.x - target.x)
		if (dist <= min) {
			return true;
		}
	},

	filterByName: function(source,target,specific_name){
		if (target.stats.name === specific_name){
			return true;
		}
	},

	filterByClass: function(source,target,classname){
		if (target.stats.classname === classname){
			return true;
		}
	},

	notTargetClass: function(source,target,classname){
		if (target.stats.classname !== classname){
			return true;
		}
	}
}

function getEntityInfrontOf(source,filter,range) {
	let fireRange = range;
	if (fireRange === undefined) {
		if (source.isInsideTrench()) {
			fireRange = source.stats.range;
		} else {
			fireRange = source.custom.range;
		}
	}
	

	for (let i = 0; i < entities.length; i++){
		const target = entities[i]

		if (!filterFunc.default(source,target,fireRange)){
			continue;
		}

		if (filter) {
			let blockedByFilter = false;
			for (let i = 0; i < filter.length; i++){
				const name = filter[i].name;
				const value = filter[i].value;
				if (!filterFunc[name](source,target,value)){
					blockedByFilter = true;
					break;
				}
			}

			if (blockedByFilter) {
				continue;
			}
		}

		return target;
	}
}


function getEntityInRange(point,range){
	const inRange = [];
	for (let i = 0; i < entities.length; i++){
		const target = entities[i];
		if (target.stats.classname === 'airplane'){continue;}
		const dist = Math.abs(point[0] - target.x)
		if (dist <= range) {
			inRange.push([target,dist])
		}
	}
	return inRange;
}

function isInsideOfTrench(source){
	const isPlayer = (source.team.name === 'player')
	for (let i = 0; i < trenches.length; i++){
		const trench = trenches[i];
		if (trench.x <= source.x && trench.x + trench.width >= source.x) {
			return trench;
		}
	}
}



class entity {
	constructor(team, stats) {
		this.x = (team.name === 'player' && -50 || mapWidth + 50);
		this.y = 0;
		this.team = team;
		this.tick = 0;
		this.health = stats.health;
		this.isMoving = false;
		this.isAttacking = false;

		this.stats = stats;

		this.custom = {
			damage: RandomIntFrom(stats.damage,0.8),
			range: RandomIntFrom(stats.range,0.75),
			cooldown: RandomIntFrom(stats.cooldown,0.8),
			mobility: RandomIntFrom(stats.mobility,0.75)
		}

		this.animation = new animation(stats.sprites);
		this.animation.setDefault('moving');
		this.animation.play();

		this.dead = false;
		this.target = null;
		this.trench = false;

		entities.push(this);
	}

	move() {
		this.isMoving = false;

		// Removes any targeted dead enemies
		if (this.target && this.target.dead) {
			this.target = null;
		}

		// Searches for new enemies
		if (!this.target) {
			if (this.customTargetFinder){
				this.customTargetFinder();
			} else {
				const target = getEntityInfrontOf(this, this.stats.targetFilter);
				if (target) {
					this.target = target;
				}
			}
			
		}

		// Checks if entity is inside of trench
		if (this.stats.classname === 'infantry' && !this.trench) {
			const trenchFound = isInsideOfTrench(this);
			if (trenchFound) {
				this.trench = trenchFound;
				this.x = trenchFound.x + trenchFound.width/2
				this.y = trenchDepth + 10
			}
		}

		// Moves this entity
		if (!(this.target || this.isInsideTrench()) || this.stats.classname === 'airplane'){
			if (this.team.name === 'player') {
				this.x += this.custom.mobility;
			} else {
				this.x -= this.custom.mobility;
			}

			if (this.stats.classname === 'airplane') {
				if (this.x >= mapWidth + 100) {
					this.x = -100;
					this.onLeaveScreen();
				} else if (this.x <= -100) {
					this.x = mapWidth;
					this.onLeaveScreen();
				}
			}

			this.isMoving = true;
		}
	}

	takeDamage(given_value) {
		let multiplier = 1;
		if (this.trench) {
			multiplier = 0.5
		}

		const damage = Math.ceil(given_value * multiplier)
		this.health = Math.max(this.health - damage,0)
		if (this.health === 0 && this.dead === false) {
			this.dead = true;

			if (this.team.name !== 'player') {
				cash += Math.floor(this.stats.price / 2);
			}
		}
	}

	update(){
		this.move();

		if (this.customUpdate){
			this.customUpdate();
		}

		// Initate attack phase
		if (this.customAttackPhase) {
			this.customAttackPhase();
		} else {
			if (this.target && this.tick === 0) {
				const cooldown = this.custom.cooldown;

				this.tick = cooldown;
				this.animation.play('attack');
				this.animation.onCompleted(() => {
					if (this.tick > 0) {
						this.isAttacking = false;
					}
				})
				this.attack();
				this.isAttacking = true;

			} else if (this.tick > 0) {
				this.tick--;
			}
		}

		if (this.isMoving || this.isAttacking) {
			this.animation.update();
		}
	}


	// GETTER
	getPosition(){
		return [this.x,this.y]
	}

	isInsideTrench(){
		return (!!this.trench)
	}

	getDistance(target){
		return [Math.abs(this.x - target.x),Math.abs(this.y - target.y)];
	}
	isBehind(target){
		const team = this.team;
		if (team.name === 'player') {
			return (target.x < this.x);
		} else if (team.name === 'computer') {
			return (target.x > this.x);
		}
	}
}



class infantry extends entity {
	constructor(team){
		super(team,stats[0])
	}

	attack() {
		const target = this.target
		let x_pos = this.x

		if (this.team.name !== 'player'){
			x_pos = target.x
		}

		particles.create({
			parent: this,
			lifetime: 1,
			x: x_pos + 5,
			y: this.y - untiSize + RandomInt(1,10),

			width: Math.abs(this.x - target.x),
			height: 2,

			color: color(255,204,0),
			target: target,

			completed: function(){
				this.target.takeDamage(this.parent.custom.damage);
			}
		})
	}
}

class artillery extends entity {
	constructor(team) {
		super(team, stats[1]);
		this.custom.damage = this.stats.damage;
	}

	attack() {
		const target = this.target;
		const dist = Math.abs(this.x - target.x)
		const arcHeight = Math.floor(dist*0.6)
		const lifetime_max = Math.floor(dist/10)
		const missRadius = Math.floor(dist/8)

		const targetX = target.x + RandomInt(-missRadius,missRadius)
		const targetPos = [
			targetX,
			findHighestYAxis(targetX) || 0
		]

		const centerPoint = [
			Math.floor(this.x + (targetPos[0] - this.x) / 2),
			Math.floor(this.y + (targetPos[1] - this.y) / 2) - arcHeight,
		]

		particles.create({
			parent: this,
			lifetime_max: lifetime_max,
			lifetime: lifetime_max,
			x: 0,
			y: 0,

			firedFrom: [this.x,this.y-10],
			firedAt: targetPos,
			centerPoint: centerPoint,
			shape: 'circle',

			radius: 5,

			color: color(50,50,50),

			target: target,

			update: function(){
				const stats = this.parent.stats
				if (this.lifetime > 2) {
					const t = 1 - (this.lifetime-2) / (this.lifetime_max-2);
					const trajectory = quadraticLerp(
						this.firedFrom,
						this.centerPoint,
						this.firedAt,
						t,
					)
					this.x = Math.floor(trajectory[0]);
					this.y = Math.floor(trajectory[1]);

					const lifetime = 10;
					particles.create({
						shape: 'circle',
						x: this.x,
						y: this.y,
						radius: 4,
						color: color(100,100,100),

						lifetime: lifetime,
						transparency: 255,

						update: function(){
							const opacity = Math.floor(255 * this.lifetime/lifetime);
							this.transparency = opacity;
						}
					})
				} else {
					const blastRadius = stats.blastRadius
					const t = (3 - this.lifetime)

					if (this.lifetime === 1) {
						this.color = color(200,50,50)
					} else {
						this.color = color(200,200,50)
						
						this.x = this.firedAt[0];
						this.y = this.firedAt[1];
						this.shape = 'circle';
					}
					this.radius = (blastRadius-10)/2 * t;
				}
			},

			completed: function(){
				const stats = this.parent.stats
				const blastRadius = stats.blastRadius;
				const baseDamage = this.parent.custom.damage;
				const hits = getEntityInRange(this.firedAt,blastRadius);
				const unitsHit = Math.min(hits.length,stats.maxHits);

				if (unitsHit === 0) {return;}

				for (let i = 0; i < unitsHit; i++){
					const [hit,dist] = hits[i];
					if (hit.team !== this.parent.team){
						const result = Math.ceil(baseDamage * (1 - dist/blastRadius));
						hit.takeDamage(Math.max(result,baseDamage*0.5));
					}
				}
				
			}
		})
	}
}

class bomber extends entity {
	constructor(team){
		super(team,stats[2]);
		this.onLeaveScreen();
		this.isCrashing = false;
		this.custom.damage = this.stats.damage;
	}

	onLeaveScreen(){
		this.y = -RandomInt(100, skyboxHeight-50);

		const maxHealth = this.stats.health;
		this.health = Math.min(maxHealth, this.health + Math.ceil(maxHealth * 0.25));

		const fall_steps = Math.floor(Math.abs(-this.y) / this.stats.bomb.fallSpeed);
		this.custom.range = fall_steps * this.stats.bomb.speedX;
	}

	attack() {
		const lifetime = Math.floor(Math.abs(this.y) / 10);
		let moveX = this.stats.bomb.speedX;
		if (this.team.name === 'computer') {
			moveX = (-moveX);
		}

		this.animation.onCompleted(() => {
			const data = {
				parent: this,
				lifetime_max: lifetime,
				lifetime: lifetime,
				shape: 'circle',
				moveX: moveX,

				startY: this.y,
				x: this.x,
				y: this.y,

				radius: 4,

				color: color(50,50,50),

				update: function(){
					this.x = this.x + this.moveX;
					this.y = Math.floor(this.startY * this.lifetime/this.lifetime_max);

					if (this.lifetime <= 2){
						const blastRadius = this.parent.stats.blastRadius
						const t = (3 - this.lifetime)

						if (this.lifetime === 1) {
							this.color = color(200,50,50)
						} else {
							this.color = color(200,200,50)
						}
						this.radius = Math.ceil((blastRadius-15)/2 * t);
					}
				},

				completed: function(){
					const stats = this.parent.stats
					const blastRadius = stats.blastRadius;
					const baseDamage = this.parent.custom.damage;
					const hits = getEntityInRange([this.x,this.y],blastRadius);
					const unitsHit = Math.min(hits.length,stats.maxHits);

					if (unitsHit === 0) {return;}

					for (let i = 0; i < unitsHit; i++){
						const [hit,dist] = hits[i];
						if (hit.team !== this.parent.team){
							const result = Math.ceil(baseDamage * (1 - dist/blastRadius));
							hit.takeDamage(Math.max(result,baseDamage*0.5));
						}
					}
				}
			}
			particles.create(data);
		})		
	}
}


class fighter extends entity {
	constructor(team){
		super(team,stats[3]);

		this.speedY = Math.floor(this.custom.mobility / 2);
		this.canAttack = false;
		this.isCrashing = false;
		this.onLeaveScreen();
	}

	onLeaveScreen(){
		this.y = -RandomInt(100,skyboxHeight-50);
		this.defaultY = this.y;

		const maxHealth = this.stats.health;
		this.health = Math.min(maxHealth,this.health + Math.ceil(maxHealth * 0.25));
	}


	customTargetFinder(){
		const filter = this.stats.targetFilter
		const targetInSight = getEntityInfrontOf(this, filter, this.stats.viewRange);
		if (targetInSight) {
			this.target = targetInSight;
		}
	}

	customUpdate(){
		if (this.target && this.target.dead === false) {
			const [distx,disty] = this.getDistance(this.target);
			const target = this.target;
			const speed_y = this.speedY;

			// aligns the airplane to match the target Y axis
			if (target.y > this.y) {
				this.y += speed_y;
			} else if (target.y < this.y) {
				this.y -= speed_y;
			}

			// align those last pixels
			if (this.y !== target && disty <= speed_y + 1) {
				this.y = target.y;
			}

			// ATTACK PHASE
			if (distx <= this.stats.range && disty <= 50) {
				
				this.canAttack = true;
			} else {
				this.canAttack = false;
			}

			if (this.isBehind(target)) {
				this.target = null;
				this.canAttack = false;
			}
		} else {
			if (this.y !== this.defaultY) {
				const velocity_y = this.speedY
				if (this.y >= this.defaultY - velocity_y && this.y - velocity_y <= this.defaultY) {
					this.y = this.defaultY;
				} else if (this.y < this.defaultY) {
					this.y += velocity_y;
				} else if (this.y > this.defaultY) {
					this.y -=  velocity_y;
				}
			}
			this.canAttack = false;
		}
	}

	customAttackPhase(){
		if (this.canAttack && this.tick === 0) {
			const cooldown = this.custom.cooldown;

			this.tick = cooldown;
			this.animation.play('attack');
			this.target.takeDamage(this.custom.damage);
		} else if (this.tick > 0) {
			this.tick--;
		}
	}
}

class tank extends entity {
	constructor(team){
		super(team,stats[4]);
	}

	attack(){
		this.target.takeDamage(this.custom.damage);
	}
}