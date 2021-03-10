
function Flag(){
	this.onReset();
	console.log("CPU Flag Register is ready");	
}

Flag.prototype.onReset = function(){

	this.ctlIn  = 0;

	$('#chk_flag_in').prop('checked', false);
	
	this.flagCarry = 0;
	this.flagZero  = 0;	

	this.update();
}

Flag.prototype.onCtlIn = function(){
	if(this.ctlIn == 0){
		this.ctlIn = 1;
	} else {
		this.ctlIn = 0;
	}
	Util.publish(CTL_CLICK);
}

Flag.prototype.onClock = function(){
	if(this.ctlIn){
		this.flagCarry = alu.isCarry();
		this.flagZero  = alu.isZero();
	}
	this.update();
}

Flag.prototype.update = function(){

	if(this.flagCarry == 1){
		$("#led_flag_cf").removeClass("off");
		$("#led_flag_cf").addClass("on");
	} else {
		$("#led_flag_cf").removeClass("on");
		$("#led_flag_cf").addClass("off");
	}

	if(this.flagZero == 1) {
		$("#led_flag_zf").removeClass("off");
		$("#led_flag_zf").addClass("on");
	} else {
		$("#led_flag_zf").removeClass("on");
		$("#led_flag_zf").addClass("off");
	}

}