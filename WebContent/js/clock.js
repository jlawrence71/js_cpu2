function Clock(){
	this.power = 0;
	
	this.onReset();
	console.log("Clock is ready to be powered up");

}

Clock.prototype.onReset = function(){
	this.interval = 1000;
	this.enable   = 0;
	
	if(this.myTimer){
		clearInterval(this.myTimer);
	}
	
	if(this.power == 5){
		this.myTimer = window.setInterval(this.onInterval, this.interval);
	}
	$('#chk_clk_hlt').prop('checked', false);
	$("#txt_clock_interval").val(this.interval);
	
	this.off();
}

Clock.prototype.onClickPulse = function(){
	Util.publish(CLK_PULSE);
	$( "#led_clock" ).animate({
	    opacity: 1
	  }, 100, function() {
		$("#led_clock").css("opacity", "");
		Util.publish(CLK_PULSE_INV);
	    clock.off();
	  });		  
}

Clock.prototype.onClickInterval = function(){
	var intervalValue = $("#txt_clock_interval").val();
	this.setInterval(intervalValue);		  
}

Clock.prototype.onCtlHlt = function(){	
	if(!this.power)
		return;
	
	if($("#chk_clk_hlt").is(':checked')){
		if(this.myTimer){
			clearInterval(this.myTimer);
		}
		this.off();
	} else {
		this.myTimer = window.setInterval(this.onInterval, this.interval);
		console.log("clk enable");		
	}
}

Clock.prototype.setInterval = function(interval){
	this.interval = interval;

	if(this.myTimer){
		clearInterval(this.myTimer);
		this.myTimer = window.setInterval(this.onInterval, this.interval);
	}

}

Clock.prototype.setPower = function(voltage){
	this.power = voltage;	
	this.onReset();
}

Clock.prototype.onInterval = function(){
	if($("#led_clock").hasClass("on")){
		clock.off();
		Util.publish(CLK_PULSE_INV);
	} else {
		clock.on();
		Util.publish(CLK_PULSE);
	}
}

Clock.prototype.on = function(){
	$("#led_clock").removeClass("off");
	$("#led_clock").addClass("on");
}

Clock.prototype.off = function(){
	$("#led_clock").removeClass("on");
	$("#led_clock").addClass("off");
}