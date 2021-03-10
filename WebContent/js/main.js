// Global Variables

var power;
var clock;
var pc;
var bus;
var alu;
var ra;
var rb;
var flag;
var output;
var mar;
var ram;
var ir;
var mc;
var idec;

var powerOn = 0;

function main(){
	clock  = new Clock();
	bus    = new Bus();
	pc     = new ProgramCounter();
	alu    = new Alu();
	ra     = new Register("a");
	rb     = new Register("b");
	flag   = new Flag();
	output = new Output();
	mar    = new Mar();
	ram    = new Ram();
	ir     = new Ir();
	idec   = new Idec();
	mc     = new Mc();
	
	// Bus Request Subscriptions
	Util.subscribeWithContext(BUS_REQ_VALUE,pc,"onBusReqValue");
	Util.subscribeWithContext(BUS_REQ_VALUE,ra,"onBusReqValue");
	
	// Clock Messages Subscribers
	
	// NOTE: Bus must be first item to respond to clock
	// Since it needs to set its value back to zero
	//Util.subscribeWithContext(CLK_PULSE,bus,"onClock");

	Util.subscribeWithContext(CLK_PULSE,pc,"onClock");
	Util.subscribeWithContext(CLK_PULSE,ra,"onClock");
	Util.subscribeWithContext(CLK_PULSE,rb,"onClock");
	Util.subscribeWithContext(CLK_PULSE,flag,"onClock");
	Util.subscribeWithContext(CLK_PULSE,output,"onClock");
	Util.subscribeWithContext(CLK_PULSE,mar,"onClock");
	Util.subscribeWithContext(CLK_PULSE,ram,"onClock");
	Util.subscribeWithContext(CLK_PULSE,ir,"onClock");

	Util.subscribeWithContext(CLK_PULSE_INV,idec,"onClockInv");
	Util.subscribeWithContext(CLK_PULSE_INV,mc,"onClockInv");

	Util.subscribeWithContext(MAR_ADDRESS_CHANGE,ram,"onAddressChange");
	
	Util.subscribeWithContext("ChangeRegister_a",alu,"onChangeA");
	Util.subscribeWithContext("ChangeRegister_b",alu,"onChangeB");

	// We are using a div to basically diable all inputs on the CPU 
	// by creating a div 'cover', which 'eats' all the click activity.
	// This div is places on top of or below (z-index) the CPU controls based
	// on the state of the power button.
	$('#clickEater').click(false);
}

function onPower(){
	
	if(powerOn){
		powerOn = 0;
		$("#clickEater").fadeTo("fast",.2);
		$("#clickEater").css("z-index",10);
		$("#btn_power").removeClass("on")
		$("#btn_power").addClass("off")
		clock.setPower(0);
	} else {	
		powerOn = 1;
		$("#clickEater").fadeTo("fast",0);
		$("#clickEater").css("z-index",-10);
		$("#btn_power").removeClass("off")
		$("#btn_power").addClass("on")
		clock.setPower(5);
	}	
	
	onReset(true);
}

function onHelp(){
	
}

function onReset(erase){
	clock.onReset();
	pc.onReset();
	bus.onReset();
	alu.onReset();
	ra.onReset();
	rb.onReset();
	flag.onReset();
	output.onReset();
	mar.onReset();
	ram.onReset(erase);
	ir.onReset();
	mc.onReset();
	idec.onReset();	
}
