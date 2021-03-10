
function ProgramCounter(){
	this.onReset();
}

ProgramCounter.prototype.onReset = function(){
	this.value     = 0;
	this.ctlOut    = 0;
	this.ctlJmp    = 0;
	this.ctlEnable = 0;

	$('#chk_pc_out').prop('checked', false);
	$('#chk_pc_jmp').prop('checked', false);
	$('#chk_pc_ce').prop('checked', false);

	this.update();
console.log("Program Counter (4-bit) is ready");	
}

ProgramCounter.prototype.onClock = function(){
	
	if(!this.ctlEnable)
		return;
	
	if(this.value < 15)
		this.value++;
	else
		this.value = 0;
		
	this.update();
}

ProgramCounter.prototype.onCtlOut = function(){
	this.ctlOut = !this.ctlOut;
	this.update();
}

ProgramCounter.prototype.onCtlJmp = function(){
	this.ctlJmp = !this.ctlJmp;
}

ProgramCounter.prototype.onCtlEnable = function(){
	this.ctlEnable = !this.ctlEnable;
	this.update();
}

ProgramCounter.prototype.update = function(){
	
	if(this.ctlOut)
		bus.setValue("pc",this.value);
	else
		bus.disconnect("pc");
	
	for(var bit=0;bit<=3;bit++){
		if((this.value >> bit) & 1){
			$("#led_pc_"+bit).removeClass("off");
			$("#led_pc_"+bit).addClass("on");
		} else {
			$("#led_pc_"+bit).removeClass("on");
			$("#led_pc_"+bit).addClass("off");	
		}
	}
}