import { extractValue, writeValue } from "./common";
// import { round, signedToInteger } from "./solaredgeUtil";

export interface SolaredgeDataEntry {
	descr: string,
	unit: string;
	role: ioBrokerRole;
	type: ioBroker.CommonType //'number' | 'string' | 'boolean' | 'array' | 'object' | 'mixed' | 'file'
	readRegister?: (SolaredgeModbusData: Buffer) => SolaredgePropertyType;
	writeRegister?: (twd: SolaredgeWriteData) => SolaredgeWriteMultipleHoldingRegister;
	writeCoil?: (twd: SolaredgeWriteData) => SolaredgeWriteSingleCoil
	value: SolaredgePropertyType;
	valueOld?: SolaredgePropertyType;
}

export type SolaredgePropertyType = number | string | boolean | null; // entspricht ioBroker.StateValue
export type SolaredgeHoldingRegister = Buffer

export interface SolaredgeWriteData  {
	value: SolaredgePropertyType,
}
export interface SolaredgeWriteMultipleHoldingRegister {
	register: number;
	value: Buffer
}

export interface SolaredgeWriteSingleCoil {
	register: number;
	value: number
}
export type ioBrokerRole = "state" | "value.current" | "value.voltage" | "value" | "value.temperature"

export class SolaredgeModbusData {
	hr : SolaredgeHoldingRegister;
	config: ioBroker.AdapterConfig;

	constructor(hr: SolaredgeHoldingRegister, config: ioBroker.AdapterConfig) {
		this.hr = hr;
		this.config = config;
	}
}


export class SolaredgeModel {
	[key: string]: SolaredgeDataEntry

 	"common.C_SunSpec_ID":    SolaredgeDataEntry = {
		descr: "Value = 'SunS' (0x53756e53). Uniquely identifies this as a SunSpec MODBUS Map",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) => extractValue("uint32be", 2, tmd, 0)  /* * tmd.scale.v */,
		value: 0,
	};

	"common.C_SunSpec_DID":    SolaredgeDataEntry = {
		descr: "Value = 0x0001. Uniquely identifies this as a SunSpec Common Model Block",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 2),
		value: 0,
	};

	"common.C_SunSpec_Length":    SolaredgeDataEntry = {
		descr: "65 = Length of block in 16-bit registers",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 3),
		value: 0,
	};

	"common.C_Manufacturer":    SolaredgeDataEntry = {
		descr: "Value Registered with SunSpec = 'SolarEdge'",
		unit:  "",
		role:  "value",
		type: "string",
		readRegister:  (tmd: Buffer) =>  extractValue("string", 16, tmd, 4),
		value: "",
	};

	"common.C_Model":    SolaredgeDataEntry = {
		descr: "SolarEdge Specific Value",
		unit:  "",
		role:  "value",
		type: "string",
		readRegister:  (tmd: Buffer) =>  extractValue("string", 16, tmd, 20),
		value: "",
	};

	"common.C_Version":    SolaredgeDataEntry = {
		descr: "SolarEdge Specific Value",
		unit:  "",
		role:  "value",
		type: "string",
		readRegister:  (tmd: Buffer) =>  extractValue("string", 8, tmd, 44),
		value: "",
	};



	"common.C_SerialNumber":    SolaredgeDataEntry = {
		descr: "SolarEdge Specific Value",
		unit:  "",
		role:  "value",
		type: "string",
		readRegister:  (tmd: Buffer) =>  extractValue("string", 8, tmd, 52),
		value: "",
	};

	"common.C_DeviceAddress":    SolaredgeDataEntry = {
		descr: "MODBUS Unit ID",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 68),
		value: 0,
	};

	"ac.C_SunSpec_DID":    SolaredgeDataEntry = {
		descr: "101 = single phase 102 = split phase 103 = three phase",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 69),
		value: 0,
	};


	// "ac.C_SunSpec_Length":    SolaredgeDataEntry = {
	// 	descr: "50 = Length of model block",
	// 	unit:  "",
	// 	role:  "value",
	// 	type: "number",
	// 	readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 70),
	// 	value: 0,
	// };

	"ac.I_AC_Current":    SolaredgeDataEntry = {
		descr: "AC Total Current value",
		unit:  "A",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 71) as number * Math.pow(10,extractValue("int16be", 1, tmd, 75) as number),
		value: 0,
	};

	"ac.I_AC_CurrentA":    SolaredgeDataEntry = {
		descr: "AC Phase A Current value",
		unit:  "A",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 72) as number * Math.pow(10,extractValue("int16be", 1, tmd, 75) as number),
		value: 0,
	};
	"ac.I_AC_CurrentB":    SolaredgeDataEntry = {
		descr: "AC Phase B Current value",
		unit:  "A",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 73) as number * Math.pow(10,extractValue("int16be", 1, tmd, 75) as number),
		value: 0,
	};
	"ac.I_AC_CurrentC":    SolaredgeDataEntry = {
		descr: "AC Phase C Current value",
		unit:  "A",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 74) as number * Math.pow(10,extractValue("int16be", 1, tmd, 75) as number),
		value: 0,
	};


	"ac.I_AC_VoltageAB":    SolaredgeDataEntry = {
		descr: "AC Voltage Phase AB value",
		unit:  "V",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 76) as number * Math.pow(10,extractValue("int16be", 1, tmd, 82) as number),
		value: 0,
	};

	"ac.I_AC_VoltageBC":    SolaredgeDataEntry = {
		descr: "AC Voltage Phase BC value",
		unit:  "V",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 77) as number * Math.pow(10,extractValue("int16be", 1, tmd, 82) as number),
		value: 0,
	};

	"ac.I_AC_VoltageCA":    SolaredgeDataEntry = {
		descr: "AC Voltage Phase CA value",
		unit:  "V",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 78) as number * Math.pow(10,extractValue("int16be", 1, tmd, 82) as number),
		value: 0,
	};

	"ac.I_AC_VoltageAN":    SolaredgeDataEntry = {
		descr: "AC Voltage Phase A to N value",
		unit:  "V",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 79) as number * Math.pow(10,extractValue("int16be", 1, tmd, 82) as number),
		value: 0,
	};

	"ac.I_AC_VoltageBN":    SolaredgeDataEntry = {
		descr: "AC Voltage Phase B to N value",
		unit:  "V",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  {
			// console.log("tmd", tmd)
			// console.log("tmd 79", tmd[79*2], tmd[79*2+1])
			// console.log("tmd 80", tmd[80*2], tmd[80*2+1])
			// console.log("tmd 81", tmd[81*2], tmd[81*2+1])
			// console.log("tmd 82", tmd[82*2], tmd[82*2+1])
			// console.log("scaling", extractValue("int16be", 1, tmd, 82))
			return extractValue("uint16be", 1, tmd, 80) as number * Math.pow(10,extractValue("int16be", 1, tmd, 82) as number)
		},
		value: 0,
	};

	"ac.I_AC_VoltageCN":    SolaredgeDataEntry = {
		descr: "AC Voltage Phase C to N value",
		unit:  "V",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 81) as number * Math.pow(10,extractValue("int16be", 1, tmd, 82) as number),
		value: 0,
	};


	"ac.I_AC_Power":    SolaredgeDataEntry = {
		descr: "AC Power value",
		unit:  "W",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("int16be", 1, tmd, 83) as number * Math.pow(10,extractValue("int16be", 1, tmd, 84) as number),
		value: 0,
	};

	"ac.I_AC_Frequency":    SolaredgeDataEntry = {
		descr: "AC Frequency value",
		unit:  "Hz",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 85) as number * Math.pow(10,extractValue("int16be", 1, tmd, 86) as number),
		value: 0,
	};

	"ac.I_AC_VA":    SolaredgeDataEntry = {
		descr: "Apparent Power",
		unit:  "VA",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("int16be", 1, tmd, 87) as number * Math.pow(10,extractValue("int16be", 1, tmd, 88) as number),
		value: 0,
	};

	"ac.I_AC_VAR":    SolaredgeDataEntry = {
		descr: "Reactive Power",
		unit:  "VAR",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("int16be", 1, tmd, 89) as number * Math.pow(10,extractValue("int16be", 1, tmd, 90) as number),
		value: 0,
	};

	"ac.I_AC_PF":    SolaredgeDataEntry = {
		descr: "Power Factor",
		unit:  "%",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("int16be", 1, tmd, 91) as number * Math.pow(10,extractValue("int16be", 1, tmd, 92) as number),
		value: 0,
	};

	"ac.I_AC_Energy_WH":    SolaredgeDataEntry = {
		descr: "AC Lifetime Energy production",
		unit:  "Wh",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 93) as number * Math.pow(10,extractValue("uint16be", 1, tmd, 94) as number),
		value: 0,
	};



	"dc.I_DC_Current":    SolaredgeDataEntry = {
		descr: "DC Current value",
		unit:  "A",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 96) as number * Math.pow(10,extractValue("int16be", 1, tmd, 97) as number),
		value: 0,
	};

	"dc.I_DC_Voltage":    SolaredgeDataEntry = {
		descr: "DC Voltage value",
		unit:  "V",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 98) as number * Math.pow(10,extractValue("int16be", 1, tmd, 99) as number),
		value: 0,
	};

	"dc.I_DC_Power":    SolaredgeDataEntry = {
		descr: "DC Power value",
		unit:  "W",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 100) as number * Math.pow(10,extractValue("int16be", 1, tmd, 101) as number),
		value: 0,
	};


	"state.I_Temp_Sink":    SolaredgeDataEntry = {
		descr: "Heat Sink Temperature",
		unit:  "°C",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("int16be", 1, tmd, 103) as number * Math.pow(10,extractValue("int16be", 1, tmd, 106) as number),
		value: 0,
	};

	"state.I_Status":    SolaredgeDataEntry = {
		descr: "Operating State",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 107) as number,
		value: 0,
	};

	"state.I_Status_Vendor":    SolaredgeDataEntry = {
		descr: "Vendor-defined operating state and error codes. For error description, meaning and troubleshooting, refer to the SolarEdge Installation Guide.",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 108) as number,
		value: 0,
	};

	"battery.manufacturer_name":    SolaredgeDataEntry = {
		descr: "Battery 1 Manufacturer Name",
		unit:  "",
		role:  "value",
		type: "string",
		readRegister:  (tmd: Buffer) =>  extractValue("string", 16, tmd, 0xE100) as number,
		value: "",
	};

	"battery.model":    SolaredgeDataEntry = {
		descr: "Battery 1 Model",
		unit:  "",
		role:  "value",
		type: "string",
		readRegister:  (tmd: Buffer) =>  extractValue("string", 16, tmd, 0xE110) as number,
		value: "",
	};

	"battery.firmware_version":    SolaredgeDataEntry = {
		descr: "Battery 1 Firmware Version",
		unit:  "",
		role:  "value",
		type: "string",
		readRegister:  (tmd: Buffer) =>  extractValue("string", 16, tmd, 0xE120) as number,
		value: "",
	};

	"battery.serial_number":    SolaredgeDataEntry = {
		descr: "Battery 1 Serial Number",
		unit:  "",
		role:  "value",
		type: "string",
		readRegister:  (tmd: Buffer) =>  extractValue("string", 16, tmd, 0xE130) as number,
		value: "",
	};

	"battery.device_id":    SolaredgeDataEntry = {
		descr: "Battery 1 Device ID",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 0xE140) as number,
		value: 0,
	};

	"battery.rated_energy":    SolaredgeDataEntry = {
		descr: "Battery 1 Rated Energy",
		unit:  "Wh",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE142) as number,
		value: 0,
	};

	"battery.charge_continues_power":    SolaredgeDataEntry = {
		descr: "Battery 1 Max Charge Continues Power",
		unit:  "W",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE144) as number,
		value: 0,
	};

	"battery.discharge_continues_power":    SolaredgeDataEntry = {
		descr: "Battery 1 Max Discharge Continues Power",
		unit:  "W",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE146) as number,
		value: 0,
	};

	"battery.charge_peak_power":    SolaredgeDataEntry = {
		descr: "Battery 1 Max Charge Peak Power",
		unit:  "W",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE148) as number,
		value: 0,
	};

	"battery.discharge_peak_power":    SolaredgeDataEntry = {
		descr: "Battery 1 Max Discharge Peak Power",
		unit:  "W",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE14A) as number,
		value: 0,
	};


	"battery.average_temperature":    SolaredgeDataEntry = {
		descr: "Battery 1 Average Temperature",
		unit:  "°C",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE16C) as number,
		value: 0,
	};

	"battery.max_temperature":    SolaredgeDataEntry = {
		descr: "Battery 1 Max Temperature",
		unit:  "°C",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE16E) as number,
		value: 0,
	};

	"battery.instantaneous_voltage":    SolaredgeDataEntry = {
		descr: "Battery 1 Instantaneous Voltage",
		unit:  "V",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE170) as number,
		value: 0,
	};

	"battery.instantaneous_current":    SolaredgeDataEntry = {
		descr: "Battery 1 Instantaneous Current",
		unit:  "A",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE172) as number,
		value: 0,
	};

	"battery.instantaneous_power":    SolaredgeDataEntry = {
		descr: "Battery 1 Instantaneous Power",
		unit:  "W",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE174) as number,
		value: 0,
	};

	"battery.lifetime_export_energy_counter":    SolaredgeDataEntry = {
		descr: "Battery 1 Lifetime Export Energy Counter",
		unit:  "Wh",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint64be", 4, tmd, 0xE176) as number,
		value: 0,
	};

	"battery.lifetime_import_energy_counter":    SolaredgeDataEntry = {
		descr: "Battery 1 Lifetime Import Energy Counter",
		unit:  "Wh",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint64be", 4, tmd, 0xE17A) as number,
		value: 0,
	};

	"battery.max_energy":    SolaredgeDataEntry = {
		descr: "Battery 1 Max Energy",
		unit:  "Wh",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE17E) as number,
		value: 0,
	};


	"battery.available_energy":    SolaredgeDataEntry = {
		descr: "Battery 1 Available Energy",
		unit:  "Wh",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE180) as number,
		value: 0,
	};


	"battery.SOH":    SolaredgeDataEntry = {
		descr: "Battery 1 State of Health (SOH)",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE182) as number,
		value: 0,
	};


	"battery.SOE":    SolaredgeDataEntry = {
		descr: "Battery 1 State of Energy (SOE)",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE184) as number,
		value: 0,
	};

	"battery.status":    SolaredgeDataEntry = {
		descr: "Battery 1 Status",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 0xE186) as number,
		value: 0,
	};

	"battery.status_internal":    SolaredgeDataEntry = {
		descr: "Battery 1 Status Internal",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 0xE188) as number,
		value: 0,
	};



	/* ***************************************************************************************************** */




	"control.storage_control_mode":    SolaredgeDataEntry = {
		descr: "0-4",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 0xE004) as number,
		writeRegister: (wd: SolaredgeWriteData) => {
			return { register: 0xE004, value: writeValue("uint16be", wd.value) }
		},
		value: 0,
	};

	"control.storage_ac_charge_policy":    SolaredgeDataEntry = {
		descr: "0-3",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 0xE005) as number,
		value: 0,
	};


	"control.storage_ac_charge_limit":    SolaredgeDataEntry = {
		descr: "0-Max_Float",
		unit:  "KWh or %",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE006) as number,
		value: 0,
	};


	"control.storage_backup_reserved_setting":    SolaredgeDataEntry = {
		descr: "0-100",
		unit:  "%",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE008) as number,
		value: 0,
	};


	"control.storage_charge_discharge_default_mode":    SolaredgeDataEntry = {
		descr: "0-7",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 0xE00A) as number,
		value: 0,
	};

	"control.remote_control_command_timeout":    SolaredgeDataEntry = {
		descr: "0-86400(24h)",
		unit:  "s",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 0xE00B) as number,
		value: 0,
	};

	"control.remote_control_command_mode":    SolaredgeDataEntry = {
		descr: "0-7",
		unit:  "",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 0xE00D) as number,
		value: 0,
	};

	"control.remote_control_charge_limit":    SolaredgeDataEntry = {
		descr: "0- Battery Max Power",
		unit:  "W",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE00E) as number,
		value: 0,
	};


	"control.remote_control_dicharge_limit":    SolaredgeDataEntry = {
		descr: "0- Battery Max Power",
		unit:  "W",
		role:  "value",
		type: "number",
		readRegister:  (tmd: Buffer) =>  extractValue("floatsw", 2, tmd, 0xE010) as number,
		value: 0,
	};
}
