
function Ir(){
	this.onReset();
	console.log("Instruction Register is ready");	
}

Ir.prototype.getValue = function(){
	return this.value;
}

Ir.prototype.onReset = function(){
	this.ctlOut   = 0;
	this.ctlIn    = 0;
	this.value    = 0;	

	$('#chk_ir_in').prop('checked', false);
	$('#chk_ir_out').prop('checked', false);
	
	this.update();
}

Ir.prototype.onCtlIn = function(){
	this.ctlIn = !this.ctlIn;
	this.update();
}

Ir.prototype.onCtlOut = function(){
	this.ctlOut = !this.ctlOut;
	this.update();
}

Ir.prototype.onClock = function(){
	if(this.ctlIn){
		this.value = bus.getValue();
		this.update();	
	}
}

Ir.prototype.update = function(){

	// 4 bit address, so only first 4 bits go to bus
	if(this.ctlOut )
		bus.setValue("ir",this.value & 0b00001111);
	else
		bus.disconnect("ir");
		
	
	// Show the Assembly Language for this instruction
	$("#instr_text").html(getInstructionFor(this.value));
	
	for(var bit=0;bit<=7;bit++){
		if((this.value >> bit) & 1){
			$("#led_ir_"+bit).removeClass("off");
			$("#led_ir_"+bit).addClass("on");
		} else {
			$("#led_ir_"+bit).removeClass("on");
			$("#led_ir_"+bit).addClass("off");	
		}
	}

}