class animation {
	constructor(sprites){
		this.sprites = sprites;
		this.image = null;
		this.frameId = 0;
		this.playing = null;
		this.current = null;
		this.frameLength = null;

		this.frameCooldown = 1;
		this.looped = true;
		this.isPaused = false;

		this.default = null;

		this.onFinishEvents = [];
	}

	update(){
		if (!this.isPaused) {
			if (this.frameId >= this.frameLength * this.frameCooldown) {
				const callbacks = this.onFinishEvents;
				if (callbacks.length !== 0) {
					for (let i = callbacks.length - 1; i >= 0; i--){
						callbacks[i]();
						callbacks.splice(i,1);
					}
				}

				if (this.looped) {
					this.frameId = 0;
				} else {
					this.reset();
					if (this.default) {
						this.repeat(this.default);
					}
					return;
				}
			}
			const id = Math.floor(this.frameId / this.frameCooldown);
			this.image = this.current.frames[id];
			if (!this.image){
				console.log(id);
			}
			this.frameId++;

			
		}
	}


	play(name){
		if (name === undefined){
			if (!this.playing) {
				this.repeat(this.default);
			} else {
				console.log('Attempted to play as default');
			}
		} else {
			if (!this.sprites.hasOwnProperty(name)){
				//console.log('Unable to play: ' + name);
				return false;
			} 
			this.current = this.sprites[name];
			this.frameId = 0;
			this.frameCooldown = this.current.frameCooldown;
			this.frameLength = this.current.frames.length;
			this.looped = false;
		}
	}

	repeat(name){
		this.play(name);
		this.looped = true;
	}

	reset(){
		this.frameCooldown = 1;
		this.frameId = 0;
		this.playing = null;
		this.current = null;
		this.looped = false;
		this.frameLength = 0;
	}

	pause(){
		this.isPaused = true;
	}

	setDefault(name){
		if (!this.sprites.hasOwnProperty(name)){
			console.log('Unable to set default to: ' + name);
			return false;
		}
		this.default = name;
	}

	// EVENTS
	onCompleted(callback){
		this.onFinishEvents.push(callback);
	}
}