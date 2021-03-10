
function Alu(){
	this.onReset();
	console.log("ALU is ready");	
}

Alu.prototype.onReset = function(){

	this.ctlOut  = 0;
	this.ctlSub  = 0;
	
	this.value    = 0;
	this.valueA   = 0;	
	this.valueB   = 0;
	
	this.carry    = 0;
	
	$('#chk_alu_out').prop('checked', false);
	$('#chk_alu_sub').prop('checked', false);
	
	this.update();
}

Alu.prototype.isCarry = function(){
	return this.carry;
}

Alu.prototype.isZero = function(){
	return !this.value;
}

Alu.prototype.onCtlSub = function(){
	this.ctlSub = !this.ctlSub;
	this.update();
}

Alu.prototype.onCtlOut = function(){
	this.ctlOut = !this.ctlOut;
	this.update();
}

Alu.prototype.onChangeA = function(){
	this.valueA = ra.getValue();
	this.update();
}

Alu.prototype.onChangeB = function(){
	this.valueB = rb.getValue();
	this.update();
}

Alu.prototype.onClock = function(){

	this.update();
}

Alu.prototype.update = function(){
	
	if(this.ctlOut )
		bus.setValue("alu",this.value);
	else
		bus.disconnect("alu");
	
	if(this.ctlSub == 1){
		var newValue = this.valueA - this.valueB;
		
		if( newValue >= 0){
			this.value = newValue;
			this.carry = 0;
		} else {
			this.value = -(newValue);
			this.carry = 1;
		}
	} else {
		var newValue = this.valueA + this.valueB; 
		
		if( newValue <= 255){
			this.value = newValue;
			this.carry = 0;
		} else {
			this.value = newValue & 255;
			this.carry = 1;
		}
	}


	for(var bit=0;bit<=7;bit++){
		if((this.value >> bit) & 1){
			$("#led_alu_"+bit).removeClass("off");
			$("#led_alu_"+bit).addClass("on");
		} else {
			$("#led_alu_"+bit).removeClass("on");
			$("#led_alu_"+bit).addClass("off");	
		}
	}
	
}