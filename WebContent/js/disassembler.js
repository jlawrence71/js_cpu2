
function disassemble(memory,programEnd){
	var program = "SAP Program...\n---------------------------------\n";
	
	for(var i=0;i<memory.length;i++){
		var value = memory[i];
		if(i == programEnd)
			program += ";; Program End/Memory Begin...\n";

		if(i < programEnd)
			program += "0x" + pad(i.toString(16),2) + "  " + getInstructionFor(value) + "\n";
		else
			program += "0x" + pad(i.toString(16),2) + "  0x" + value.toString(16) + "\n";
	}
	
	return program;
}

function disassembleMicrocode(memory_0,memory_1){
	var microcode = "SAP Microcode...\n---------------------------------\n";
	microcode += ".......H123\n";
	
	for(var i=0;i<memory_0.length;i++){
		var value_0 = memory_0[i];
		var value_1 = memory_1[i];

		if(value_0){
			microcode += "0x" + pad(i.toString(16),3) + ".." + pad(value_1.toString(2),8) + ".." + pad(value_0.toString(2),8) + "\n";
		} else {
			microcode += "0x" + pad(i.toString(16),3) + "  -------- --------\n";
		}
			
	}
	
	return microcode;
}

function pad(n, width, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

function getInstructionFor(value){
	
	operand  = value & 0b00001111;
	instr    = value >> 4;
	
	switch(instr){
		case 0 :
			return "NOP";
		case 1 :
			return "LDA " + operand;
		case 2 :
			return "ADD " + operand;
// For Turing Completeness
		case 3 :
			return "JMP " + operand;
		case 4 :
			return "JZ " + operand;
		case 14 :
			return "OUT";
		case 15 :
			return "HLT";
		default :
			return "??? -" + instr;
	}
}

function compile(){
	// 10 rest();
	// 20 store(28,14); 
	// 30 store(14,15);
	// 40 add(14,15);
	// 50 display();
	// 60 stop();
}