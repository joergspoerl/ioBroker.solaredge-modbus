// Solaredge MODBUS

import { SolaredgeHoldingRegister, SolaredgeDataEntry, SolaredgeModel, SolaredgeWriteSingleCoil, SolaredgeWriteMultipleHoldingRegister } from "./solaredgeModel";

/* eslint-disable @typescript-eslint/no-var-requires */
// create a tcp modbus client
const modbus = require("jsmodbus");
const net = require("net");

export class SolaredgeTCPModbus {
	log: ioBroker.Logger
	bufferSize = 0xFFFF
	buf: Buffer = Buffer.alloc(this.bufferSize * 2)

	SolaredgeData = new SolaredgeModel();
	sendHoldingRegisterQueue: Array<SolaredgeWriteMultipleHoldingRegister> = []
	sendCoilQueue: Array<SolaredgeWriteSingleCoil> = []

	lastConnectedTimestamp = 0
	connectionErrorCounter = 0

	constructor(log: ioBroker.Logger) {
		this.log = log
		this.log.debug("solaredgeTCPModbus constructor")

	}

	private async sleep(ms:number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
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

	async readAndWrite(adapterConfig: ioBroker.AdapterConfig): Promise<void> {

		// this.log.debug("readAndWrite start")

		await this.connect(adapterConfig, async (client) => {
			//await this.sleep(1000000 )

			// while(true) {}
			while (this.sendHoldingRegisterQueue.length > 0) {
				const item = this.sendHoldingRegisterQueue.pop()
				this.log.debug("request writeSingleRegister " + JSON.stringify(item))
				const response = await client.writeMultipleRegisters(item?.register, item?.value)
				this.log.debug("response writeSingleRegister " + JSON.stringify(response))
				await this.sleep(1000)
			}

			await this.readHoldingRegisterBlock(client, 0, 111)                  // sun-spec block
			await this.sleep(100)
			await this.readHoldingRegisterBlock(client, 0xE004, 0xE012 - 0xE004) // control block
			await this.sleep(100)
			await this.readHoldingRegisterBlock(client, 0xE100, 0xE16C - 0xE100) // battery1 block1
			await this.sleep(100)
			await this.readHoldingRegisterBlock(client, 0xE16C, 0xE19A - 0xE16C) // battery1 block2
			await this.sleep(100)
			await this.readHoldingRegisterBlock(client, 40123, 40226 - 40123) // meter 1 block1
			await this.sleep(100)
			await this.readHoldingRegisterBlock(client, 40227, 40294 - 40227) // meter 1 block2
			await this.sleep(100)

			await this.updateSolaredgeData(this.buf)
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

	async connect(adapterConfig: ioBroker.AdapterConfig, callback: (client: any) => Promise<void>): Promise<any> {
		const config = adapterConfig
		return new Promise<any>((resolve, reject) => {
			// this.log.debug("connect to host: " + config.hostname)
			// this.log.debug("connect to unitId: " + config.unitId)

			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const self = this;

			try {
				// create a modbus client
				const netSocket = new net.Socket()
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const client = new modbus.client.TCP(netSocket, config.unitId);

				netSocket.on("connect", async () => {
					// this.log.debug("connected ...")

					// call modbus command
					try {
						self.lastConnectedTimestamp = Date.now()

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

				netSocket.connect({
					"host": config.hostname, //192.168.1.32 TS10480676
					"port": config.port,
					"autoReconnect": false,
					"reconnectTimeout": 4000,
					"timeout": 1000,
				})

			} catch (Exception) {
				this.log.error("ERROR in connect" + JSON.stringify(Exception))
				reject(Exception);
			}

		})

	}



}