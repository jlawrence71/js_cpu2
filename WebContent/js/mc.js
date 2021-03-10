// Mc - Micro Code class

function Mc(){
	this.enabled = 0;
	this.onReset(true);
	console.log("Microcode is ready");	
}

Mc.prototype.onReset = function(eraseMicrocode){
	this.value = 0;
	
	// 0 = from ir/id, 1 = from manual input
	this.select = 0
	
	if(eraseMicrocode){
		// Each eeprom is 16*1024 = 16k bytes.
		this.eeprom16k_0 = new Array(16*1024);
		this.eeprom16k_1 = new Array(16*1024);

		$("#mc_program").val('CLR');
		this.loadCLR();
	}
	
	this.resetManualAddress();
	this.resetManualInput();
	this.update();
}

Mc.prototype.resetManualAddress = function(){	
	for(var bit=0;bit<=6;bit++)
		$('#chk_mc_addr_bit_'+bit).prop('checked',false);
}

Mc.prototype.resetManualInput = function(){
	for(var bit=0;bit<=15;bit++){
		$('#chk_mc_bit_'+bit).prop('checked',false);
	}
}

Mc.prototype.onProgramList = function(){	
	var dis = disassembleMicrocode(this.eeprom16k_0,this.eeprom16k_1);
	alert(dis);
}

Mc.prototype.getManualAddress = function(){
	var address = 0;

	for(var bit=0;bit<=7;bit++){
		if($("#chk_mc_addr_bit_"+bit).is(":checked"))
			address += Math.pow(2, bit);
	}
		
	return address;
}

Mc.prototype.onMcEnableToggle = function(){
	this.enabled = !this.enabled;
	
	this.update();
}

Mc.prototype.onProgramSelect = function(){
	var program = $( "#mc_program option:selected" ).text();
console.log("Loading "+program+"...")	

	switch(program){

	case "Microcode42" :
		this.loadMicrocode42();
		break;
		case "Fetch+5" :
			this.loadFetchPlus5();
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

Mc.prototype.loadCLR = function(){
	this.eeprom16k_0 = new Array(16*1024);
	this.eeprom16k_1 = new Array(16*1024);
}

Mc.prototype.getIrIdAddress = function(){
	var step      = idec.getValue();
	var instr     = ir.getValue();
	var instr_cmd = (instr & 0b11110000) >> 4;
	var instr_op  = instr & 0b00001111;	

	return (instr_cmd << 3) + step;
}

Mc.prototype.getAddress = function(){
	
	if(this.select == 0){
		return this.getIrIdAddress();
	} else {
		return this.getManualAddress();
	}
}

Mc.prototype.getValue = function(add){
	var address = this.getAddress();
	var byte_0 = this.eeprom16k_0[address];
	var byte_1 = this.eeprom16k_1[address];

	return (byte_1 << 8) + byte_0;
}

Mc.prototype.onManual = function(){
	// If we are engaging manual address, automatically change address select
	if(this.select == 0)
		this.select = 1;
	
	this.update();
}

//This clock pulse happens in between regular clock pulses (trailing edge)
Mc.prototype.onClockInv = function(){
	
	if(this.enabled == 1)
		this.clearControlLines();
	
	// Get 8 bits from each of our 'eeproms'
	var address = this.getAddress();
	var byte_0 = this.eeprom16k_0[address];
	var byte_1 = this.eeprom16k_1[address];	
	
	// Build 16 bit control word
	this.value = (byte_1 << 8) + byte_0;
	
	this.update();
	
	// Allow free range play by only setting control lines when enabled	*-*-
	if(this.enabled == 1){
		this.setControlLines();
		idec.advance();
	}
}

Mc.prototype.onAddressSelect = function(){
	
	// Invert selection
	this.select = !this.select;

	// If we are switching from maunal to ir/id
	// Remove value from register
	if(this.select == 0){
		this.resetManualAddress();
	} else {
		//this.onManual();
	}
	
	this.update();
}

Mc.prototype.clearControlLines = function(){
	
	// Reset all components control lines to off
	//clock.onCtlHlt(0);
	mar.ctlIn    = 0;
	ram.ctlIn    = 0;
	ram.ctlOut   = 0;
	ir.ctlOut    = 0;
	ir.ctlIn     = 0;
	ra.ctlIn     = 0;
	ra.ctlOut    = 0;
	alu.ctlOut   = 0;
	alu.ctlSub   = 0;
	rb.ctlIn     = 0;
	output.ctlIn = 0;
	pc.ctlEnable = 0;
	pc.ctlOut    = 0;
	pc.ctlJmp    = 0;
	flag.ctlIn   = 0;
	
	bus.onReset();
	
	// Reset all check boxes
	//$('#chk_clk_hlt').prop('checked',false);
	$('#chk_mar_in').prop('checked',false);
	$('#chk_ram_in').prop('checked',false);
	$('#chk_ram_out').prop('checked',false);
	$('#chk_ir_out').prop('checked',false);
	$('#chk_ir_in').prop('checked',false);
	$('#chk_ra_in').prop('checked',false);
	$('#chk_ra_out').prop('checked',false);
	$('#chk_alu_out').prop('checked',false);
	$('#chk_alu_sub').prop('checked',false);
	$('#chk_rb_in').prop('checked',false);
	$('#chk_output_in').prop('checked',false);
	$('#chk_pc_ce').prop('checked',false);
	$('#chk_pc_out').prop('checked',false);
	$('#chk_pc_jmp').prop('checked',false);
	$('#chk_flag_in').prop('checked',false);
}

Mc.prototype.setControlLines = function(){
	
	if((this.value >> 15) & 1){
		$('#chk_clk_hlt').prop('checked',true);
		clock.onCtlHlt();
	}

	if((this.value >> 14) & 1){
		mar.onCtlIn();
		$('#chk_mar_in').prop('checked',true);
	}

	if((this.value >> 13) & 1){
		ram.onCtlIn();
		$('#chk_ram_in').prop('checked',true);
	}

	if((this.value >> 12) & 1){
		ram.onCtlOut();
		$('#chk_ram_out').prop('checked',true);
	}

	if((this.value >> 11) & 1){
		ir.onCtlOut();
		$('#chk_ir_out').prop('checked',true);
	}

	if((this.value >> 10) & 1){
		ir.onCtlIn();
		$('#chk_ir_in').prop('checked',true);
	}

	if((this.value >> 9) & 1){
		ra.onCtlIn();
		$('#chk_ra_in').prop('checked',true);
	}

	if((this.value >> 8) & 1){
		ra.onCtlOut();
		$('#chk_ra_out').prop('checked',true);
	}

	if((this.value >> 7) & 1){
		alu.onCtlOut();
		$('#chk_alu_out').prop('checked',true);
	}

	if((this.value >> 6) & 1){
		alu.onCtlSub();
		$('#chk_alu_sub').prop('checked',true);
	}

	if((this.value >> 5) & 1){
		rb.onCtlIn();
		$('#chk_rb_in').prop('checked',true);
	}

	if((this.value >> 4) & 1){
		output.onCtlIn();
		$('#chk_output_in').prop('checked',true);
	}

	if((this.value >> 3) & 1){
		pc.onCtlEnable();
		$('#chk_pc_ce').prop('checked',true);
	}

	if((this.value >> 2) & 1){
		pc.onCtlOut();
		$('#chk_pc_out').prop('checked',true);
	}

	if((this.value >> 1) & 1){
		pc.onCtlJmp();
		$('#chk_pc_jmp').prop('checked',true);
	}

	if((this.value >> 0) & 1){
		flag.onCtlIn();
		$('#chk_flag_in').prop('checked',true);
	}

}

Mc.prototype.loadMicrocode42 = function(){
	// Microcode 42
	//
	//                        Address                          Value
	//                        ------------------------------   -------------------
	//  Time  Control Lines   Unused bit  Instruction   Step   Byte 1     Byte 0
	//  ----  --------------  ----------  -----------   ----   --------   --------
	//  T0                    0           0000          000    00010010   00001000
	//  T1                    0           0000          001    01000000   00000100
	//  T2                    0           0000          010    00010000   00100000
	//  T3                    0           0000          011    00000000   10010000
	//  T4                    0           0000          100    10000000   00000000

	this.store(0b00000000,0b00010010,0b00001000);
	this.store(0b00000001,0b01000000,0b00000100);
	this.store(0b00000010,0b00010000,0b00100000);
	this.store(0b00000011,0b00000000,0b10010000);
	this.store(0b00000100,0b10000000,0b00000000);
}

Mc.prototype.loadFetchPlus5 = function(){
	// Microcode for first program
	// Each bit in the overall value represents a control line.
	// byte 0 - hlt, mi, ri, ro, io, ii, ai, ao
	// byte 1 - sigmaO, su, bi, oi, ce, co, j, fi
	
	// Fetch Cycle - common to all instructions
	//
	//                        Address                          Value
	//                        ------------------------------   ---------------------------
	//  Time  Control Lines   Unused bit  Instruction   Step   Byte 1     Byte 0
	//  ----  --------------  ----------  -----------   -----  --------   --------
	//  T0    co mi           0           ****          000    01000000   00000100
	//  T1    ro ii ce        0           ****          001    00010100   00001000
	
	// TO
	for(var instr=0;instr<=15;instr++){
		var address = (instr << 3) + 0b000;
		this.store(address,0b01000000,0b00000100);
	}
	// T1
	for(var instr=0;instr<=15;instr++){
		var address = (instr << 3) + 0b001;
		this.store(address,0b00010100,0b00001000);
	}
	
	// NOP - No Operation
	//
	//                        Address                          Value
	//                        ------------------------------   -------------------
	//  Time  Control Lines   Unused bit  Instruction   Step   Byte 1     Byte 0
	//  ----  --------------  ----------  -----------   ----   --------   --------
	//  T2                    0           0000          010    01001000   00000000
	//  T3                    0           0000          011    00010010   00000000
	//  T4                    0           0000          100    00000000   00000000

	this.store(0b00001010,0b01001000,0b00000000);
	this.store(0b00001011,0b00010010,0b00000000);
	this.store(0b00001100,0b00000000,0b00000000);

	// LDA - Load Register A
	//
	//                        Address                          Value
	//                        ------------------------------   -------------------
	//  Time  Control Lines   Unused bit  Instruction   Step   Byte 1     Byte 0
	//  ----  --------------  ----------  -----------   ----   --------   --------
	//  T2    mi io           0           0001          010    01001000   00000000
	//  T3    ro ai           0           0001          011    00010010   00000000
	//  T4                    0           0001          100    00000000   00000000

	this.store(0b00001010,0b01001000,0b00000000);
	this.store(0b00001011,0b00010010,0b00000000);
	this.store(0b00001100,0b00000000,0b00000000);
	
	// ADD - Add
	//
	//                        Address                          Value
	//                        ------------------------------   -------------------
	//  Time  Control Lines   Unused bit  Instruction   Step   Byte 1     Byte 0
	//  ----  --------------  ----------  -----------   ----   --------   --------
	//  T2    mi io           0           0010          010    01001000   00000000
	//  T3    ro bi           0           0010          011    00010000   00100000
	//  T4    ai sigma-o      0           0010          100    00000010   10000000

	this.store(0b00010010,0b01001000,0b00000000);
	this.store(0b00010011,0b00010000,0b00100000);
	this.store(0b00010100,0b00000010,0b10000000);
	
	// OUT - Display result
	//
	//                        Address                          Value
	//                        ------------------------------   -------------------
	//  Time  Control Lines   Unused bit  Instruction   Step   Byte 1     Byte 0
	//  ----  --------------  ----------  -----------   ----   --------   --------
	//  T2    ao io           0           1110          010    00000001   00010000
	//  T3                    0           1110          011    00000000   00000000
	//  T4                    0           1110          100    00000000   00000000

	this.store(0b01110010,0b00000001,0b00010000);
	this.store(0b01110011,0b00000000,0b00000000);
	this.store(0b01110100,0b00000000,0b00000000);
	
	// HLT - Halt clock and stop CPU
	//
	//                        Address                          Value
	//                        ------------------------------   -------------------
	//  Time  Control Lines   Unused bit  Instruction   Step   Byte 1     Byte 0
	//  ----  --------------  ----------  -----------   ----   --------   --------
	//  T2    hlt             0           1111          010    10000000   00000000
	//  T3                    0           1111          011    00000000   00000000
	//  T4                    0           1111          100    00000000   00000000

	this.store(0b01111010,0b10000000,0b00000000);
	this.store(0b01111011,0b00000000,0b00000000);
	this.store(0b01111100,0b00000000,0b00000000);	
}

Mc.prototype.store = function(address,byte_1,byte_0){
	this.eeprom16k_0[address] = byte_0;
	this.eeprom16k_1[address] = byte_1;
}

Mc.prototype.onStoreClick = function(){
	var newValue_0 = 0;
	var newValue_1 = 0;
	
	for(var bit=0;bit<=7;bit++){
		if($("#chk_mc_bit_"+bit).is(":checked"))
			newValue_0 += Math.pow(2,bit);
	}

	for(var bit=0;bit<=7;bit++){
		if($("#chk_mc_bit_"+(bit+8)).is(":checked"))
			newValue_1 += Math.pow(2,bit);
	}
	
	this.store(this.getAddress(),newValue_1,newValue_0);
	this.update();
}

Mc.prototype.update = function(){

	// Enable/disable button
	if(this.enabled == 0){
		$("#btn_mc_enable_toggle").html("disabled");
		$("#btn_mc_enable_toggle").removeClass("enabled");
		$("#btn_mc_enable_toggle").addClass("disabled");
	} else {
		$("#btn_mc_enable_toggle").html("enabled");
		$("#btn_mc_enable_toggle").removeClass("disabled");
		$("#btn_mc_enable_toggle").addClass("enabled");
	}
		
	// address source LEDs
	if(this.select == 0){
		$("#led_mc_manual").removeClass("on");
		$("#led_mc_manual").addClass("off");
		$("#led_mc_ir-id").removeClass("off");
		$("#led_mc_ir-id").addClass("on");
	} else {
		$("#led_mc_manual").removeClass("off");
		$("#led_mc_manual").addClass("on");
		$("#led_mc_ir-id").removeClass("on");
		$("#led_mc_ir-id").addClass("off");		
	}
	
	// Control Word LEDs
	for(var bit=0;bit<=15;bit++){
		if((this.getValue() >> bit) & 1){
			$("#led_cw_"+bit).removeClass("off");
			$("#led_cw_"+bit).addClass("on");
		} else {
			$("#led_cw_"+bit).removeClass("on");
			$("#led_cw_"+bit).addClass("off");	
		}
	}

}