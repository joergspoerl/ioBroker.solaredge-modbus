// Solaredge MODBUS

import { SolaredgeHoldingRegister, SolaredgeDataEntry, SolaredgeModel, SolaredgeWriteSingleCoil, SolaredgeWriteSingleHoldingRegister } from "./solaredgeModel";

/* eslint-disable @typescript-eslint/no-var-requires */
// create a tcp modbus client
const modbus = require("jsmodbus");
const net = require("net");

export class SolaredgeTCPModbus {
	log: ioBroker.Logger
	bufferSize = 0xFFFF
	buf: Buffer = Buffer.alloc(this.bufferSize * 2)

	SolaredgeData = new SolaredgeModel();
	sendHoldingRegisterQueue: Array<SolaredgeWriteSingleHoldingRegister> = []
	sendCoilQueue: Array<SolaredgeWriteSingleCoil> = []


	constructor(log: ioBroker.Logger) {
		this.log = log
		this.log.debug("solaredgeTCPModbus constructor")

	}

	async updateSolaredgeData(hr: SolaredgeHoldingRegister): Promise<void> {
		const tmd = hr as Buffer;

		for (const [name, value] of Object.entries(this.SolaredgeData)) {
			const v = value as SolaredgeDataEntry;

			if (typeof v.readRegister === "function") {
				v.valueOld = v.value;
				try {
					v.value = v.readRegister(tmd)
				} catch (Exception) {
					this.log.error("updateSolaredgeData ERROR '" + name + "'" + JSON.stringify(v) +  " Exception: " +JSON.stringify(Exception))
				}
			}
		}
	}

	async writeHoldingRegister(adapterConfig: ioBroker.AdapterConfig): Promise<void> {

		await this.connect(adapterConfig, async (client) => {
			while (this.sendHoldingRegisterQueue.length > 0) {
				const item = this.sendHoldingRegisterQueue.pop()
				const response = await client.writeSingleRegister(item?.register, item?.value)
				this.log.debug("response writeSingleRegister " + JSON.stringify(response))
			}
		})
	}

	async readHoldingRegister(adapterConfig: ioBroker.AdapterConfig): Promise<void> {

		this.log.debug("readHoldingRegister start")

		await this.connect(adapterConfig, async (client) => {

			await this.readHoldingRegisterBlock(client, 0, 110)                  // sun-spec block
			await this.readHoldingRegisterBlock(client, 0xE004, 0xE011 - 0xE004) // control block
			await this.readHoldingRegisterBlock(client, 0xE100, 0xE16C - 0xE100) // battery1 block1
			await this.readHoldingRegisterBlock(client, 0xE16C, 0xE19A - 0xE16C) // battery1 block2

			this.updateSolaredgeData(this.buf)
		})
	}

	debugBuffer() {
		this.log.debug("SolaredgeHoldingRegister debugBuffer " + JSON.stringify(this.buf))
		// for (let i = 0; i<this.buf.byteLength; i++) {
		// 	console.log("i=",i,this.buf[i])
		// }
	}
	async readHoldingRegisterBlock(client : any, start: number, end: number): Promise<void> {

		const block = await client.readHoldingRegisters(start, end)
		const b: Buffer = Buffer.from(block.response._body._valuesAsBuffer)
		b.copy(this.buf, start * 2)
	}
	async writeCoil(adapterConfig: ioBroker.AdapterConfig): Promise<void> {

		await this.connect(adapterConfig, async (client) => {
			while (this.sendCoilQueue.length > 0) {
				const item = this.sendCoilQueue.pop()
				const response = await client.writeSingleCoil(item?.register, item?.value == 1 ? true : false)
				this.log.debug("response writeCoil " + JSON.stringify(response))
			}
		})
	}

	async connect(adapterConfig: ioBroker.AdapterConfig, callback: (client: any) => Promise<void>): Promise<any> {
		const config = adapterConfig
		return new Promise<any>((resolve, reject) => {
			this.log.debug("connect to host: " + config.hostname)
			this.log.debug("connect to unitId: " + config.unitId)

			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const self = this;

			try {
				// create a modbus client
				const netSocket = new net.Socket()
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const client = new modbus.client.TCP(netSocket, config.unitId);

				netSocket.connect({
					"host": config.hostname, //192.168.1.32 TS10480676
					"port": config.port,
					// 'autoReconnect': true,
					// 'reconnectTimeout': 4000,
					// 'timeout': 8000,
				})

				netSocket.on("connect", async () => {
					this.log.debug("connected ...")

					// call modbus command
					try {
						await callback(client)
						netSocket.end();
						resolve(self.SolaredgeData);
					}

					catch (Exception) {
						this.log.error("ERROR in callback" + JSON.stringify(Exception))
						netSocket.end();
						reject(Exception);
					}


				});


				netSocket.on("error", (err: any) => {
					this.log.error("netSocket ERROR" + JSON.stringify(err))
					reject(err);

				})

			} catch (Exception) {
				this.log.error("ERROR in connect" + JSON.stringify(Exception))
				reject(Exception);
			}

		})

	}


}