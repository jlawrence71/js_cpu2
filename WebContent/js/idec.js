
// Note:  This class was names 'Id' with a global var of 'id' for the instance.  Javascript seems to be ok with this,
//        But the browsers has fits with setting an event such as onclick='id.xyz'.  Says it's not a function.  So I renamed
//        this class to Idec and the global var to match 'idec'.  This bug was driving me crazy !!!
function Idec(){
	this.enabled = 0;
	this.onReset();
	console.log("Instruction Decoder is ready");
}

Idec.prototype.onReset = function(){
	this.value = 0;
	this.update();
}

Idec.prototype.onIdEnableToggle = function(){
	this.enabled = !this.enabled;
	this.update();
}

// This clock pulse happens in between regular clock pulses
Idec.prototype.onClockInv = function(){
	if(this.enabled == 0)
		return;
	this.update();
}

Idec.prototype.advance = function(){
	if(this.enabled == 0)
		return;

	if(this.value < 4)
		this.value++;
	else
		this.value = 0;
}

Idec.prototype.getValue = function(){
	return this.value;
}

Idec.prototype.update = function(){

	// Enable button
	if(this.enabled == 0){
		$("#btn_id_enable_toggle").html("disabled");
		$("#btn_id_enable_toggle").removeClass("enabled");
		$("#btn_id_enable_toggle").addClass("disabled");
	} else {
		$("#btn_id_enable_toggle").html("enabled");
		$("#btn_id_enable_toggle").removeClass("disabled");
		$("#btn_id_enable_toggle").addClass("enabled");
	}
	
	// Micro Code Step Counter
	for(var bit=0;bit<=2;bit++){
		if((this.value >> bit) & 1){
			$("#led_id_"+bit).removeClass("off");
			$("#led_id_"+bit).addClass("on");
		} else {
			$("#led_id_"+bit).removeClass("on");
			$("#led_id_"+bit).addClass("off");	
		}
	}
	
	// Time indicator
	for(var i=0;i<5;i++){
		if(this.value == i){
			$("#led_id_T"+i).removeClass("off");
			$("#led_id_T"+i).addClass("on");
		} else {
			$("#led_id_T"+i).removeClass("on");
			$("#led_id_T"+i).addClass("off");	
		}		
	}
}