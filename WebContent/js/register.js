
function Register(id){
	this.id=id;
	this.onReset();
	console.log("Register '"+this.id+"'is ready");	
}

Register.prototype.getValue = function(){
	return this.value;
}

Register.prototype.onReset = function(){
	this.ctlOut   = 0;
	this.ctlIn    = 0;
	this.value    = 0;	

	$('#chk_r'+this.id+'_in').prop('checked', false);
	$('#chk_r'+this.id+'_out').prop('checked', false);
	this.update();
}

Register.prototype.onCtlIn = function(){
	this.ctlIn = !this.ctlIn;
}

Register.prototype.onCtlOut = function(){
	this.ctlOut = !this.ctlOut;
	this.update();
}

Register.prototype.onClock = function(){
	if(this.ctlIn){
		this.value = bus.getValue();
		this.update();
		Util.publish("ChangeRegister_"+this.id);
	}
}

Register.prototype.update = function(){

	if(this.ctlOut == 1)
		bus.setValue(this.id,this.value);
	else
		bus.disconnect(this.id);
	
	for(var bit=0;bit<=7;bit++){
		if((this.value >> bit) & 1){
			$("#led_r"+this.id+"_"+bit).removeClass("off");
			$("#led_r"+this.id+"_"+bit).addClass("on");
		} else {
			$("#led_r"+this.id+"_"+bit).removeClass("on");
			$("#led_r"+this.id+"_"+bit).addClass("off");	
		}
	}

}