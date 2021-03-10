
function Output(){
	this.onReset();
	console.log("Output is ready");	
}

Output.prototype.onReset = function(){
	this.ctlIn  = 0;
	this.value = 0;
	
	$('#chk_output_in').prop('checked', false);

	this.update();
}

Output.prototype.onCtlIn = function(){
	if(this.ctlIn == 0){
		this.ctlIn = 1;
	} else {
		this.ctlIn = 0;
	}
	Util.publish(CTL_CLICK);
}

Output.prototype.onClock = function(){
	if(this.ctlIn){
		this.value = bus.getValue();
	}
	this.update();
}

Output.prototype.update = function(){
	
	var display = "";
	if(this.value < 10){
		display = "00" + this.value;
	} else if(this.value < 100){
		display = "0" + this.value;
	} else {
		display = this.value;
	}
	
	
	$("#display_value").html(display);
}