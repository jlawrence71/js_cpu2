
function Bus(){
	this.onReset();
	
	console.log("Bus is ready");
}

Bus.prototype.onReset = function(){
	this.value = 0;
	this.connected = new Object();
	
	this.update();
}

// As bus should not have any state, we must reset its value to 0
// It must be the first component to receive the clock pulse.
Bus.prototype.onClock = function(){
	this.onReset();
}

Bus.prototype.setValue = function(name,value){
	this.connected[name] = value;
	this.update();
}

Bus.prototype.disconnect = function(name){
	delete this.connected[name];
	this.update();
}

Bus.prototype.getValue = function(){
	var value = 0;
	
	// OR all the values to get actual bus value.
	var keys = Object.keys(this.connected);
	
	for(var i=0;i<keys.length;i++){
		var key = keys[i];
		var storedValue = this.connected[key];
		value = value | storedValue; 
	}
	
	return value;
}

Bus.prototype.update = function(){
	
	this.value = this.getValue();
	
	for(var bit=0;bit<=7;bit++){
		if((this.value >> bit) & 1){
			$("#led_bus_"+bit).removeClass("off");
			$("#led_bus_"+bit).addClass("on");
		} else {
			$("#led_bus_"+bit).removeClass("on");
			$("#led_bus_"+bit).addClass("off");	
		}
	}
}