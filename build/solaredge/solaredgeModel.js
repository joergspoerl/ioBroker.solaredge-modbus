"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolaredgeModel = exports.SolaredgeModbusData = void 0;
const common_1 = require("./common");
class SolaredgeModbusData {
    constructor(hr, config) {
        this.hr = hr;
        this.config = config;
    }
}
exports.SolaredgeModbusData = SolaredgeModbusData;
class SolaredgeModel {
    constructor() {
        this["common.C_SunSpec_ID"] = {
            descr: "Value = 'SunS' (0x53756e53). Uniquely identifies this as a SunSpec MODBUS Map",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 0) /* * tmd.scale.v */,
            value: 0,
        };
        this["common.C_SunSpec_DID"] = {
            descr: "Value = 0x0001. Uniquely identifies this as a SunSpec Common Model Block",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 2),
            value: 0,
        };
        this["common.C_SunSpec_Length"] = {
            descr: "65 = Length of block in 16-bit registers",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 3),
            value: 0,
        };
        this["common.C_Manufacturer"] = {
            descr: "Value Registered with SunSpec = 'SolarEdge'",
            unit: "",
            role: "value",
            type: "string",
            readRegister: (tmd) => (0, common_1.extractValue)("string", 16, tmd, 4),
            value: "",
        };
        this["common.C_Model"] = {
            descr: "SolarEdge Specific Value",
            unit: "",
            role: "value",
            type: "string",
            readRegister: (tmd) => (0, common_1.extractValue)("string", 16, tmd, 20),
            value: "",
        };
        this["common.C_Version"] = {
            descr: "SolarEdge Specific Value",
            unit: "",
            role: "value",
            type: "string",
            readRegister: (tmd) => (0, common_1.extractValue)("string", 8, tmd, 44),
            value: "",
        };
        this["common.C_SerialNumber"] = {
            descr: "SolarEdge Specific Value",
            unit: "",
            role: "value",
            type: "string",
            readRegister: (tmd) => (0, common_1.extractValue)("string", 8, tmd, 52),
            value: "",
        };
        this["common.C_DeviceAddress"] = {
            descr: "MODBUS Unit ID",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 68),
            value: 0,
        };
        this["ac.C_SunSpec_DID"] = {
            descr: "101 = single phase 102 = split phase 103 = three phase",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 69),
            value: 0,
            states: {
                "101": "single phase",
                "102": "split phase",
                "103": "three phase"
            }
        };
        // "ac.C_SunSpec_Length":    SolaredgeDataEntry = {
        // 	descr: "50 = Length of model block",
        // 	unit:  "",
        // 	role:  "value",
        // 	type: "number",
        // 	readRegister:  (tmd: Buffer) =>  extractValue("uint16be", 1, tmd, 70),
        // 	value: 0,
        // };
        this["ac.I_AC_Current"] = {
            descr: "AC Total Current value",
            unit: "A",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 71) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 75)),
            value: 0,
        };
        this["ac.I_AC_CurrentA"] = {
            descr: "AC Phase A Current value",
            unit: "A",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 72) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 75)),
            value: 0,
        };
        this["ac.I_AC_CurrentB"] = {
            descr: "AC Phase B Current value",
            unit: "A",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 73) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 75)),
            value: 0,
        };
        this["ac.I_AC_CurrentC"] = {
            descr: "AC Phase C Current value",
            unit: "A",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 74) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 75)),
            value: 0,
        };
        this["ac.I_AC_VoltageAB"] = {
            descr: "AC Voltage Phase AB value",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 76) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 82)),
            value: 0,
        };
        this["ac.I_AC_VoltageBC"] = {
            descr: "AC Voltage Phase BC value",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 77) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 82)),
            value: 0,
        };
        this["ac.I_AC_VoltageCA"] = {
            descr: "AC Voltage Phase CA value",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 78) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 82)),
            value: 0,
        };
        this["ac.I_AC_VoltageAN"] = {
            descr: "AC Voltage Phase A to N value",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 79) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 82)),
            value: 0,
        };
        this["ac.I_AC_VoltageBN"] = {
            descr: "AC Voltage Phase B to N value",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => {
                // console.log("tmd", tmd)
                // console.log("tmd 79", tmd[79*2], tmd[79*2+1])
                // console.log("tmd 80", tmd[80*2], tmd[80*2+1])
                // console.log("tmd 81", tmd[81*2], tmd[81*2+1])
                // console.log("tmd 82", tmd[82*2], tmd[82*2+1])
                // console.log("scaling", extractValue("int16be", 1, tmd, 82))
                return (0, common_1.extractValue)("uint16be", 1, tmd, 80) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 82));
            },
            value: 0,
        };
        this["ac.I_AC_VoltageCN"] = {
            descr: "AC Voltage Phase C to N value",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 81) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 82)),
            value: 0,
        };
        this["ac.I_AC_Power"] = {
            descr: "AC Power value",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 83) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 84)),
            value: 0,
        };
        this["ac.I_AC_Frequency"] = {
            descr: "AC Frequency value",
            unit: "Hz",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 85) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 86)),
            value: 0,
        };
        this["ac.I_AC_VA"] = {
            descr: "Apparent Power",
            unit: "VA",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 87) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 88)),
            value: 0,
        };
        this["ac.I_AC_VAR"] = {
            descr: "Reactive Power",
            unit: "VAR",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 89) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 90)),
            value: 0,
        };
        this["ac.I_AC_PF"] = {
            descr: "Power Factor",
            unit: "%",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 91) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 92)),
            value: 0,
        };
        this["ac.I_AC_Energy_WH"] = {
            descr: "AC Lifetime Energy production",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 93) * Math.pow(10, (0, common_1.extractValue)("uint16be", 1, tmd, 94)),
            value: 0,
        };
        this["dc.I_DC_Current"] = {
            descr: "DC Current value",
            unit: "A",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 96) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 97)),
            value: 0,
        };
        this["dc.I_DC_Voltage"] = {
            descr: "DC Voltage value",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 98) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 99)),
            value: 0,
        };
        this["dc.I_DC_Power"] = {
            descr: "DC Power value",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 100) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 101)),
            value: 0,
        };
        this["state.I_Temp_Sink"] = {
            descr: "Heat Sink Temperature",
            unit: "°C",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 103) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 106)),
            value: 0,
        };
        this["state.I_Status"] = {
            descr: "Operating State",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 107),
            value: 0,
            states: {
                "1": "Off",
                "2": "Sleeping (auto-shutdown) – Night mode",
                "3": "Grid Monitoring/wake-up",
                "4": "Inverter is ON and producing power",
                "5": "Production (curtailed)",
                "6": "Shutting down",
                "7": "Fault",
                "8": "Maintenance/setup"
            }
        };
        this["state.I_Status_Vendor"] = {
            descr: "Vendor-defined operating state and error codes. For error description, meaning and troubleshooting, refer to the SolarEdge Installation Guide.",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 108),
            value: 0,
        };
        this["battery.manufacturer_name"] = {
            descr: "Battery 1 Manufacturer Name",
            unit: "",
            role: "value",
            type: "string",
            readRegister: (tmd) => (0, common_1.extractValue)("string", 16, tmd, 0xE100),
            value: "",
        };
        this["battery.model"] = {
            descr: "Battery 1 Model",
            unit: "",
            role: "value",
            type: "string",
            readRegister: (tmd) => (0, common_1.extractValue)("string", 16, tmd, 0xE110),
            value: "",
        };
        this["battery.firmware_version"] = {
            descr: "Battery 1 Firmware Version",
            unit: "",
            role: "value",
            type: "string",
            readRegister: (tmd) => (0, common_1.extractValue)("string", 16, tmd, 0xE120),
            value: "",
        };
        this["battery.serial_number"] = {
            descr: "Battery 1 Serial Number",
            unit: "",
            role: "value",
            type: "string",
            readRegister: (tmd) => (0, common_1.extractValue)("string", 16, tmd, 0xE130),
            value: "",
        };
        this["battery.device_id"] = {
            descr: "Battery 1 Device ID",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 0xE140),
            value: 0,
        };
        this["battery.rated_energy"] = {
            descr: "Battery 1 Rated Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE142),
            value: 0,
        };
        this["battery.charge_continues_power"] = {
            descr: "Battery 1 Max Charge Continues Power",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE144),
            value: 0,
        };
        this["battery.discharge_continues_power"] = {
            descr: "Battery 1 Max Discharge Continues Power",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE146),
            value: 0,
        };
        this["battery.charge_peak_power"] = {
            descr: "Battery 1 Max Charge Peak Power",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE148),
            value: 0,
        };
        this["battery.discharge_peak_power"] = {
            descr: "Battery 1 Max Discharge Peak Power",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE14A),
            value: 0,
        };
        this["battery.average_temperature"] = {
            descr: "Battery 1 Average Temperature",
            unit: "°C",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE16C),
            value: 0,
        };
        this["battery.max_temperature"] = {
            descr: "Battery 1 Max Temperature",
            unit: "°C",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE16E),
            value: 0,
        };
        this["battery.instantaneous_voltage"] = {
            descr: "Battery 1 Instantaneous Voltage",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE170),
            value: 0,
        };
        this["battery.instantaneous_current"] = {
            descr: "Battery 1 Instantaneous Current",
            unit: "A",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE172),
            value: 0,
        };
        this["battery.instantaneous_power"] = {
            descr: "Battery 1 Instantaneous Power",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE174),
            value: 0,
        };
        this["battery.lifetime_export_energy_counter"] = {
            descr: "Battery 1 Lifetime Export Energy Counter",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint64be", 4, tmd, 0xE176),
            value: 0,
        };
        this["battery.lifetime_import_energy_counter"] = {
            descr: "Battery 1 Lifetime Import Energy Counter",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint64be", 4, tmd, 0xE17A),
            value: 0,
        };
        this["battery.max_energy"] = {
            descr: "Battery 1 Max Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE17E),
            value: 0,
        };
        this["battery.available_energy"] = {
            descr: "Battery 1 Available Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE180),
            value: 0,
        };
        this["battery.SOH"] = {
            descr: "Battery 1 State of Health (SOH)",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE182),
            value: 0,
        };
        this["battery.SOE"] = {
            descr: "Battery 1 State of Energy (SOE)",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE184),
            value: 0,
        };
        this["battery.status"] = {
            descr: "Battery 1 Status",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 0xE186),
            value: 0,
        };
        this["battery.status_internal"] = {
            descr: "Battery 1 Status Internal",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 0xE188),
            value: 0,
        };
        /* ***************************************************************************************************** */
        this["control.storage_control_mode"] = {
            descr: "0-4",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 0xE004),
            writeRegister: (wd) => {
                const value = typeof wd.value == "number" ? wd.value : 0;
                return { register: 0xE004, value: (0, common_1.writeValue)("uint16be", value) };
            },
            value: 0,
            states: {
                "0": "Disabled",
                "1": "Maximize Self Consumption - meter required",
                "2": "Time of Use (Profile programming) - meter required",
                "3": "Backup Only",
                "4": "Remote Control"
            }
        };
        this["control.storage_ac_charge_policy"] = {
            descr: "0-3",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 0xE005),
            writeRegister: (wd) => {
                const value = typeof wd.value == "number" ? wd.value : 0;
                return { register: 0xE005, value: (0, common_1.writeValue)("uint16be", value) };
            },
            value: 0,
            states: {
                "0": "Disable",
                "1": "Always allowed",
                "2": "Fixed Energy Limit (for US regulation)",
                "3": "Percent of Production (for US regulation)",
            }
        };
        this["control.storage_ac_charge_limit"] = {
            descr: "0-Max_Float",
            unit: "KWh or %",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE006),
            writeRegister: (wd) => {
                const value = typeof wd.value == "number" ? wd.value : 0;
                return { register: 0xE006, value: (0, common_1.writeValue)("floatsw", value) };
            },
            value: 0,
        };
        this["control.storage_backup_reserved_setting"] = {
            descr: "0-100",
            unit: "%",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE008),
            writeRegister: (wd) => {
                const value = typeof wd.value == "number" ? wd.value : 0;
                return { register: 0xE008, value: (0, common_1.writeValue)("floatsw", value) };
            },
            value: 0,
        };
        this["control.storage_charge_discharge_default_mode"] = {
            descr: "0-7",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 0xE00A),
            writeRegister: (wd) => {
                const value = typeof wd.value == "number" ? wd.value : 0;
                return { register: 0xE00A, value: (0, common_1.writeValue)("uint16be", value) };
            },
            value: 0,
            states: {
                "0": "Off",
                "1": "Charge excess PV power only",
                "2": "Charge from PV first, before producing power to the AC",
                "3": "Charge from PV+AC according to the max battery power",
                "4": "Maximize export – discharge battery to meet max inverter AC limit",
                "5": "Discharge to meet loads consumption. Discharging to the grid is not allowed",
                "7": "Maximize self-consumption",
            }
        };
        this["control.remote_control_command_timeout"] = {
            descr: "0-86400(24h)",
            unit: "s",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 0xE00B),
            writeRegister: (wd) => {
                const value = typeof wd.value == "number" ? wd.value : 0;
                return { register: 0xE00B, value: (0, common_1.writeValue)("uint32be", value) };
            },
            value: 0,
        };
        this["control.remote_control_command_mode"] = {
            descr: "0-7",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint16be", 1, tmd, 0xE00D),
            writeRegister: (wd) => {
                const value = typeof wd.value == "number" ? wd.value : 0;
                return { register: 0xE00D, value: (0, common_1.writeValue)("uint16be", value) };
            },
            value: 0,
            states: {
                "0": "Off",
                "1": "Charge excess PV power only",
                "2": "Charge from PV first, before producing power to the AC",
                "3": "Charge from PV+AC according to the max battery power",
                "4": "Maximize export – discharge battery to meet max inverter AC limit",
                "5": "Discharge to meet loads consumption. Discharging to the grid is not allowed",
                "7": "Maximize self-consumption",
            }
        };
        this["control.remote_control_charge_limit"] = {
            descr: "0- Battery Max Power",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE00E),
            writeRegister: (wd) => {
                const value = typeof wd.value == "number" ? wd.value : 0;
                return { register: 0xE00E, value: (0, common_1.writeValue)("floatsw", value) };
            },
            value: 0,
        };
        this["control.remote_control_dicharge_limit"] = {
            descr: "0- Battery Max Power",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("floatsw", 2, tmd, 0xE010),
            writeRegister: (wd) => {
                const value = typeof wd.value == "number" ? wd.value : 0;
                return { register: 0xE010, value: (0, common_1.writeValue)("floatsw", value) };
            },
            value: 0,
        };
        this["meter.1.C_Manufacturer"] = {
            descr: "Meter manufacturer",
            unit: "",
            role: "value",
            type: "string",
            readRegister: (tmd) => (0, common_1.extractValue)("string", 32, tmd, 40123),
            value: 0,
        };
        this["meter.1.C_Model"] = {
            descr: "Meter model",
            unit: "",
            role: "value",
            type: "string",
            readRegister: (tmd) => (0, common_1.extractValue)("string", 32, tmd, 40139),
            value: 0,
        };
        this["meter.1.M_AC_Current"] = {
            descr: "AC Current (sum of active phases)",
            unit: "A",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40190) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40194)),
            value: 0,
        };
        this["meter.1.M_AC_Current_A"] = {
            descr: "Phase A AC Current",
            unit: "A",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40191) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40194)),
            value: 0,
        };
        this["meter.1.M_AC_Current_B"] = {
            descr: "Phase B AC Current",
            unit: "A",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40192) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40194)),
            value: 0,
        };
        this["meter.1.M_AC_Current_C"] = {
            descr: "Phase C AC Current",
            unit: "A",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40193) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40194)),
            value: 0,
        };
        this["meter.1.M_AC_Voltage_L_N"] = {
            descr: "Line to Neutral AC Voltage (average of active phases)",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40195) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40203)),
            value: 0,
        };
        this["meter.1.M_AC_Voltage_A_N"] = {
            descr: "Phase A to Neutral AC Voltage",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40196) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40203)),
            value: 0,
        };
        this["meter.1.M_AC_Voltage_B_N"] = {
            descr: "Phase B to Neutral AC Voltage",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40197) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40203)),
            value: 0,
        };
        this["meter.1.M_AC_Voltage_C_N"] = {
            descr: "Phase C to Neutral AC Voltage",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40198) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40203)),
            value: 0,
        };
        this["meter.1.M_AC_Voltage_L_L"] = {
            descr: "Line to Line AC Voltage (average of active phases)",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40199) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40203)),
            value: 0,
        };
        this["meter.1.M_AC_Voltage_A_B"] = {
            descr: "Phase A to Phase B AC Voltage",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40200) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40203)),
            value: 0,
        };
        this["meter.1.M_AC_Voltage_B_C"] = {
            descr: "Phase B to Phase C AC Voltage",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40201) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40203)),
            value: 0,
        };
        this["meter.1.M_AC_Voltage_C_A"] = {
            descr: "Phase C to Phase A AC Voltage",
            unit: "V",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40202) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40203)),
            value: 0,
        };
        this["meter.1.M_AC_Freq"] = {
            descr: "AC Frequency",
            unit: "Hz",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40204) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40205)),
            value: 0,
        };
        this["meter.1.M_AC_Power"] = {
            descr: "Total Real Power (sum of active phases)",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40206) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40210)),
            value: 0,
        };
        this["meter.1.M_AC_Power_A"] = {
            descr: "Phase A AC Real Power",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40207) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40210)),
            value: 0,
        };
        this["meter.1.M_AC_Power_B"] = {
            descr: "Phase B AC Real Power",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40208) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40210)),
            value: 0,
        };
        this["meter.1.M_AC_Power_C"] = {
            descr: "Phase C AC Real Power",
            unit: "W",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40209) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40210)),
            value: 0,
        };
        this["meter.1.M_AC_VA"] = {
            descr: "Total AC Apparent Power (sum of active phases)",
            unit: "VA",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40211) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40215)),
            value: 0,
        };
        this["meter.1.M_AC_VA_A"] = {
            descr: "Phase A AC Apparent Power",
            unit: "VA",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40212) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40215)),
            value: 0,
        };
        this["meter.1.M_AC_VA_B"] = {
            descr: "Phase B AC Apparent Power",
            unit: "VA",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40213) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40215)),
            value: 0,
        };
        this["meter.1.M_AC_VA_C"] = {
            descr: "Phase C AC Apparent Power",
            unit: "VA",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40214) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40215)),
            value: 0,
        };
        this["meter.1.M_AC_VAR"] = {
            descr: "Total AC Reactive Power (sum of active phases)",
            unit: "VAR",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40216) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40220)),
            value: 0,
        };
        this["meter.1.M_AC_VAR_A"] = {
            descr: "Phase A AC Reactive Power",
            unit: "VAR",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40217) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40220)),
            value: 0,
        };
        this["meter.1.M_AC_VAR_B"] = {
            descr: "Phase B AC Reactive Power",
            unit: "VAR",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40218) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40220)),
            value: 0,
        };
        this["meter.1.M_AC_VAR_C"] = {
            descr: "Phase C AC Reactive Power",
            unit: "VAR",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40219) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40220)),
            value: 0,
        };
        this["meter.1.M_AC_PF"] = {
            descr: "Average Power Factor (average of active phases)",
            unit: "%",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40221) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40225)),
            value: 0,
        };
        this["meter.1.M_AC_PF_A"] = {
            descr: "Phase A Power Factor",
            unit: "%",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40222) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40225)),
            value: 0,
        };
        this["meter.1.M_AC_PF_B"] = {
            descr: "Phase A Power Factor",
            unit: "%",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40223) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40225)),
            value: 0,
        };
        this["meter.1.M_AC_PF_C"] = {
            descr: "Phase A Power Factor",
            unit: "%",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("int16be", 1, tmd, 40224) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40225)),
            value: 0,
        };
        this["meter.1.M_Exported"] = {
            descr: "Total Exported Real Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40226) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40242)),
            value: 0,
        };
        this["meter.1.M_Exported_A"] = {
            descr: "Phase A Exported Real Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40228) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40242)),
            value: 0,
        };
        this["meter.1.M_Exported_B"] = {
            descr: "Phase B Exported Real Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40230) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40242)),
            value: 0,
        };
        this["meter.1.M_Exported_C"] = {
            descr: "Phase C Exported Real Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40232) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40242)),
            value: 0,
        };
        this["meter.1.M_Imported"] = {
            descr: "Total Imported Real Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40234) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40242)),
            value: 0,
        };
        this["meter.1.M_Imported_A"] = {
            descr: "Phase A Imported Real Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40236) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40242)),
            value: 0,
        };
        this["meter.1.M_Imported_B"] = {
            descr: "Phase B Imported Real Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40238) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40242)),
            value: 0,
        };
        this["meter.1.M_Imported_C"] = {
            descr: "Phase C Imported Real Energy",
            unit: "Wh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40240) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40242)),
            value: 0,
        };
        this["meter.1.M_Exported_VA"] = {
            descr: "Total Exported Apparent Energy",
            unit: "VAh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40243) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40259)),
            value: 0,
        };
        this["meter.1.M_Exported_VA_A"] = {
            descr: "Phase A Exported Apparent Energy",
            unit: "VAh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40245) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40259)),
            value: 0,
        };
        this["meter.1.M_Exported_VA_B"] = {
            descr: "Phase B Exported Apparent Energy",
            unit: "VAh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40247) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40259)),
            value: 0,
        };
        this["meter.1.M_Exported_VA_C"] = {
            descr: "Phase C Exported Apparent Energy",
            unit: "VAh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40249) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40259)),
            value: 0,
        };
        this["meter.1.M_Imported_VA"] = {
            descr: "Total Imported Apparent Energy",
            unit: "VAh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40251) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40259)),
            value: 0,
        };
        this["meter.1.M_Imported_VA_A"] = {
            descr: "Phase A Imported Apparent Energy",
            unit: "VAh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40253) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40259)),
            value: 0,
        };
        this["meter.1.M_Imported_VA_B"] = {
            descr: "Phase B Imported Apparent Energy",
            unit: "VAh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40255) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40259)),
            value: 0,
        };
        this["meter.1.M_Imported_VA_C"] = {
            descr: "Phase C Imported Apparent Energy",
            unit: "VAh",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40257) * Math.pow(10, (0, common_1.extractValue)("int16be", 1, tmd, 40259)),
            value: 0,
        };
        // "meter.1.M_Import_VARh_Q1":    SolaredgeDataEntry = {
        // 	descr: "Quadrant 1: Total Imported Reactive Energy",
        // 	unit:  "VARh",
        // 	role:  "value",
        // 	type: "number",
        // 	readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 40260) as number * Math.pow(10,extractValue("int16be", 1, tmd, 40292) as number),
        // 	value: 0,
        // };
        // "meter.1.M_Import_VARh_Q1A":    SolaredgeDataEntry = {
        // 	descr: "Phase A - Quadrant 1: Imported Reactive Energy",
        // 	unit:  "VARh",
        // 	role:  "value",
        // 	type: "number",
        // 	readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 40262) as number * Math.pow(10,extractValue("int16be", 1, tmd, 40292) as number),
        // 	value: 0,
        // };
        // "meter.1.M_Import_VARh_Q1B":    SolaredgeDataEntry = {
        // 	descr: "Phase B - Quadrant 1: Imported Reactive Energy",
        // 	unit:  "VARh",
        // 	role:  "value",
        // 	type: "number",
        // 	readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 40264) as number * Math.pow(10,extractValue("int16be", 1, tmd, 40292) as number),
        // 	value: 0,
        // };
        // "meter.1.M_Import_VARh_Q1C":    SolaredgeDataEntry = {
        // 	descr: "Phase C - Quadrant 1: Imported Reactive Energy",
        // 	unit:  "VARh",
        // 	role:  "value",
        // 	type: "number",
        // 	readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 40266) as number * Math.pow(10,extractValue("int16be", 1, tmd, 40292) as number),
        // 	value: 0,
        // };
        // "meter.1.M_Import_VARh_Q2":    SolaredgeDataEntry = {
        // 	descr: "Quadrant 2: Total Imported Reactive Energy",
        // 	unit:  "VARh",
        // 	role:  "value",
        // 	type: "number",
        // 	readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 40268) as number * Math.pow(10,extractValue("int16be", 1, tmd, 40292) as number),
        // 	value: 0,
        // };
        // "meter.1.M_Import_VARh_Q2A":    SolaredgeDataEntry = {
        // 	descr: "Phase A - Quadrant 2: Imported Reactive Energy",
        // 	unit:  "VARh",
        // 	role:  "value",
        // 	type: "number",
        // 	readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 40270) as number * Math.pow(10,extractValue("int16be", 1, tmd, 40292) as number),
        // 	value: 0,
        // };
        // "meter.1.M_Import_VARh_Q2B":    SolaredgeDataEntry = {
        // 	descr: "Phase B - Quadrant 2: Imported Reactive Energy",
        // 	unit:  "VARh",
        // 	role:  "value",
        // 	type: "number",
        // 	readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 40272) as number * Math.pow(10,extractValue("int16be", 1, tmd, 40292) as number),
        // 	value: 0,
        // };
        // "meter.1.M_Import_VARh_Q2C":    SolaredgeDataEntry = {
        // 	descr: "Phase C - Quadrant 2: Imported Reactive Energy",
        // 	unit:  "VARh",
        // 	role:  "value",
        // 	type: "number",
        // 	readRegister:  (tmd: Buffer) =>  extractValue("uint32be", 2, tmd, 40274) as number * Math.pow(10,extractValue("int16be", 1, tmd, 40292) as number),
        // 	value: 0,
        // };
        this["meter.1.M_Events"] = {
            descr: "See M_EVENT_ flags. 0 = nts.",
            unit: "",
            role: "value",
            type: "number",
            readRegister: (tmd) => (0, common_1.extractValue)("uint32be", 2, tmd, 40293),
            value: 0,
        };
    }
}
exports.SolaredgeModel = SolaredgeModel;
//# sourceMappingURL=solaredgeModel.js.map