
// helper function to convert signed value to integer
export function signedToInteger(value: number): number {
	if ((value & 0x8000) > 0) {
		value = value - 0x10000;
	}
	return value;
}

export function round (value: number, decimals: number): number {
	const d = Math.pow(10, decimals)
	if (!isNaN(value)) {
		return Math.round ( value * d) / d;
	}
	return 0;
}

export function to32bitNumber (hi: number, lo: number) : number {
	return (hi << 16) + lo
}

const faultsTextArray = [
	"overcurrent",
	"FETs shorted",
	"software bug",
	"battery HVD",
	"array HVD",
	"settings switch changed",
	"custom settings edit",
	"RTS shorted",
	"RTS disconnected",
	"EEPROM retry limit",
	"Reserved",
	"Slave Control Timeout",
	"Fault 13",
	"Fault 14",
	"Fault 15",
	"Fault 16",
]

export function resolveFaultsBitfield (value: number) : Array<string> {
	const r : Array<string> = [];
	for (let i = 0;i<16;i++) {
		if ((value & 0b00000001) === 1) r.push(faultsTextArray[i])
		value = value >> 1
	}
	return r
}
export const alarmTextArray = [
	"RTS open",
	"RTS shorted",
	"RTS disconnected",
	"Heatsink temp sensor open",
	"Heatsink temp sensor shorted",
	"High temperature current limit",
	"Current limit",
	"Current offset",
	"Battery sense out of range",
	"Battery sense disconnected",
	"Uncalibrated",
	"RTS miswire",
	"High voltage disconnect",
	"Undefined",
	"system miswire",
	"MOSFET open",
	"P12 voltage off",
	"High input voltage current limit",
	"ADC input max",
	"Controller was reset",
	"Alarm 21",
	"Alarm 22",
	"Alarm 23",
	"Alarm 24",
]
export function resolveAlarmBitfield (value: number) : Array<string> {
	const r : Array<string> = [];
	for (let i = 0;i<24;i++) {
		if ((value & 0b00000001) === 1) r.push(alarmTextArray[i])
		value = value >> 1
	}
	return r
}

export interface IChargeStates {
	[index: number]:string
}
export const charge_states : IChargeStates = {
	0 : "START",
	1 : "NIGHT_CHECK",
	2 : "DISCONNECT",
	3 : "NIGHT",
	4 : "FAULT",
	5 : "",
	6 : "ABSORPTION",
	7 : "FLOAT",
	8 : "EQUALIZE",
	9 : "SLAVE",
}

export const ledState: {[index: number]:string} = {
	0: "LED_START",
	1: "LED_START2",
	2: "LED_BRANCH",
	3: "FAST GREEN BLINK",
	4: "SLOW GREEN BLINK",
	5: "GREEN BLINK, 1HZ",
	6: "GREEN_LED",
	7: "UNDEFINED",
	8: "YELLOW_LED",
	9: "UNDEFINED",
	10: "BLINK_RED_LED",
	11: "RED_LED",
	12: "R-Y-G ERROR",
	13: "R/Y-G ERROR",
	14: "R/G-Y ERROR",
	15: "R-Y ERROR (HTD)",
	16: "R-G ERROR (HVD)",
	17: "R/Y-G/Y ERROR",
	18: "G/Y/R ERROR",
	19: "G/Y/R x 2",
}

export function byteString(n:number): string {
	if (n < 0 || n > 255 || n % 1 !== 0) {
		throw new Error(n + " does not fit in a byte");
	}
	return ("000000000" + n.toString(2)).substr(-8)
}

export function splitIdFromAdapter(str: string): string  {
	const delimiter = "."
	const start = 2
	const tokens = str.split(delimiter).slice(start)
	return tokens.join(delimiter);
}

