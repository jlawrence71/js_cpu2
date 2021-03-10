function Mar(){
	this.onReset();
	console.log("Memory Address Register (mar) is ready");	
}

Mar.prototype.onReset = function(){
	this.ctlIn  = 0;
	this.value  = 0;

	$('#chk_mar_in').prop('checked', false);
	
	// 0 = from bus, 1 = from manual input
	this.select = 0
	
	this.resetManualAddress();
	this.update();
}

Mar.prototype.resetManualAddress = function(){
	for(var bit = 0;bit<=3;bit++){
		$('#chk_mar_manual_bit_'+bit).prop('checked',false);
	}
}

Mar.prototype.onAddressSelect = function(){
	
	// Invert selection
	this.select = !this.select;

	// If we are switching from maunal to bus
	// Remove value from register
	if(this.select == 0){
		this.value = 0;
		this.resetManualAddress();
	} else {
		// If we are switching from bus to manual
		$("#chk_mar_in").prop('checked', false);
		this.ctlIn = 0;
		this.onManual();
	}
	
	this.update();
}

Mar.prototype.onManual = function(){
	var newValue = 0;

	// If we are engaging manual address, automatically change address select
	if(this.select == 0)
		this.select = 1;
	
	for(var bit=0;bit<=3;bit++){
		if($("#chk_mar_manual_bit_"+bit).is(":checked"))
			newValue += Math.pow(2,bit);
	}	
	
	this.value = newValue;
	this.update();
}

Mar.prototype.getValue = function(){
	return this.value;
}

Mar.prototype.onCtlIn = function(){
		
	if(this.ctlIn == 0){
		this.ctlIn = 1;
		
		if(this.select == 1){
			this.select = 0;
		}
		
	} else {
		this.ctlIn = 0;
	}
	Util.publish(CTL_CLICK);
}

Mar.prototype.onClock = function(){
	this.update();
}

Mar.prototype.update = function(){

	// As address is only 4 bits, discard what is not needed from bus value
	if(this.ctlIn){
		this.value = bus.getValue();
		this.value = this.value & 0b00001111;
	}
	
	Util.publish(MAR_ADDRESS_CHANGE);
	
	if(this.select == 0){
		$("#led_mar_manual").removeClass("on");
		$("#led_mar_manual").addClass("off");
		$("#led_mar_bus").removeClass("off");
		$("#led_mar_bus").addClass("on");
	} else {
		$("#led_mar_manual").removeClass("off");
		$("#led_mar_manual").addClass("on");
		$("#led_mar_bus").removeClass("on");
		$("#led_mar_bus").addClass("off");		
	}
	
	for(var bit=0;bit<=3;bit++){
		if((this.value >> bit) & 1){
			$("#led_mar_"+bit).removeClass("off");
			$("#led_mar_"+bit).addClass("on");
		} else {
			$("#led_mar_"+bit).removeClass("on");
			$("#led_mar_"+bit).addClass("off");	
		}
	}
}