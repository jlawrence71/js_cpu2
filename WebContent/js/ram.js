
function Ram(){
	this.onReset(true);
	console.log("RAM (ram) is ready");	
}

Ram.prototype.onReset = function(eraseRam){
	this.ctlIn  = 0;
	this.ctlOut = 0;
	this.value  = 0;

	$('#chk_ram_in').prop('checked', false);
	$('#chk_ram_out').prop('checked', false);
	
	if(eraseRam ){
		$("#ram_program").val('CLR');
		this.loadCLR();
	}
	
	this.resetManualInput();
	
	this.update();
}

Ram.prototype.resetManualInput = function(){
	for(var bit=0;bit<=7;bit++){
		$('#chk_ram_bit_'+bit).prop('checked',false);
	}
}

Ram.prototype.getValue = function(){
	var address = mar.getValue()
	return this.memory[address];
}

Ram.prototype.onProgramSelect = function(){
	var program = $( "#ram_program option:selected" ).text();
console.log("Loading "+program+"...")	

	switch(program){
	
		case "Hello 42" :
			this.loadHello42();
			break;
		case "CLR" :
			this.loadCLR();
			break;
		default :
			alert("Unknown Program - "+program);
			break;
	}
 	this.update();
}

Ram.prototype.onProgramList = function(){
	
	var dis = disassemble(this.memory,14);
	alert(dis);
}

Ram.prototype.loadCLR = function(){
	// Empty Memory contents
	this.memory = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
console.log("Size-"+this.memory.length);	
}

Ram.prototype.loadHello42 = function(){
	// First Program
	// 0x00 NOP      0000 0000
	// 0x01 LDA 14   0001 1110
	// 0x02 ADD 15   0010 1111
	// 0x03 OUT      1110 0000
	// 0x04 HLT      1111 0000
	// ....
	// NOTE: Values for memory
	// 0x0E          0001 1100   ; decimal 28
	// 0x0F          0000 1110   ; decimal 14
	this.memory = [0b00000000,0b00011110,0b00101111,0b11100000,0b11110000,0,0,0,0,0,0,0,0,0,0b00011100,0b00001110];
}

Ram.prototype.onCtlIn = function(value){	
	this.ctlIn = !this.ctlIn
}

Ram.prototype.onCtlOut = function(){
	this.ctlOut = !this.ctlOut;
	this.update();
}

Ram.prototype.onAddressChange = function(){
	this.update();
}

Ram.prototype.onStoreClick = function(){
	var newValue = 0;
	
	for(var bit=0;bit<=7;bit++){
		if($("#chk_ram_bit_"+bit).is(":checked"))
			newValue += Math.pow(2,bit);
	}
	
	this.memory[mar.getValue()] = newValue;
	this.update();
}

Ram.prototype.onClock = function(){
	// Latch value into register
	if(this.ctlIn){
		var newValue = bus.getValue();
		this.memory[mar.getValue()] = newValue;
		this.update();
	}
}

Ram.prototype.update = function(){
	var value = this.getValue();
	
	if(this.ctlOut)
		bus.setValue("ram",value);
	else
		bus.disconnect("ram");
	
	for(var bit=0;bit<=7;bit++){
		if((value >> bit) & 1){
			$("#led_ram_"+bit).removeClass("off");
			$("#led_ram_"+bit).addClass("on");
		} else {
			$("#led_ram_"+bit).removeClass("on");
			$("#led_ram_"+bit).addClass("off");	
		}
	}
}