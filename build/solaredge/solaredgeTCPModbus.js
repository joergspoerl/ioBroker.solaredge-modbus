"use strict";
// Solaredge MODBUS
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolaredgeTCPModbus = void 0;
const solaredgeModel_1 = require("./solaredgeModel");
/* eslint-disable @typescript-eslint/no-var-requires */
// create a tcp modbus client
const modbus = require("jsmodbus");
const net = require("net");
class SolaredgeTCPModbus {
    constructor(log) {
        this.bufferSize = 0xFFFF;
        this.buf = Buffer.alloc(this.bufferSize * 2);
        this.SolaredgeData = new solaredgeModel_1.SolaredgeModel();
        this.sendHoldingRegisterQueue = [];
        this.sendCoilQueue = [];
        this.log = log;
        this.log.debug("solaredgeTCPModbus constructor");
    }
    async updateSolaredgeData(hr) {
        const tmd = hr;
        for (const [name, value] of Object.entries(this.SolaredgeData)) {
            const v = value;
            if (typeof v.readRegister === "function") {
                v.valueOld = v.value;
                try {
                    v.value = v.readRegister(tmd);
                }
                catch (Exception) {
                    this.log.error("updateSolaredgeData ERROR '" + name + "'" + JSON.stringify(v) + " Exception: " + JSON.stringify(Exception));
                }
            }
        }
    }
    async readAndWrite(adapterConfig) {
        this.log.debug("readAndWrite start");
        await this.connect(adapterConfig, async (client) => {
            while (this.sendHoldingRegisterQueue.length > 0) {
                const item = this.sendHoldingRegisterQueue.pop();
                this.log.debug("request writeSingleRegister " + JSON.stringify(item));
                const response = await client.writeMultipleRegisters(item === null || item === void 0 ? void 0 : item.register, item === null || item === void 0 ? void 0 : item.value);
                this.log.debug("response writeSingleRegister " + JSON.stringify(response));
            }
            await this.readHoldingRegisterBlock(client, 0, 110); // sun-spec block
            await this.readHoldingRegisterBlock(client, 0xE004, 0xE011 - 0xE004); // control block
            await this.readHoldingRegisterBlock(client, 0xE100, 0xE16C - 0xE100); // battery1 block1
            await this.readHoldingRegisterBlock(client, 0xE16C, 0xE19A - 0xE16C); // battery1 block2
            this.updateSolaredgeData(this.buf);
        });
    }
    debugBuffer() {
        this.log.debug("SolaredgeHoldingRegister debugBuffer " + JSON.stringify(this.buf));
        // for (let i = 0; i<this.buf.byteLength; i++) {
        // 	console.log("i=",i,this.buf[i])
        // }
    }
    async readHoldingRegisterBlock(client, start, end) {
        const block = await client.readHoldingRegisters(start, end);
        const b = Buffer.from(block.response._body._valuesAsBuffer);
        b.copy(this.buf, start * 2);
    }
    // async writeCoil(adapterConfig: ioBroker.AdapterConfig): Promise<void> {
    // 	await this.connect(adapterConfig, async (client) => {
    // 		while (this.sendCoilQueue.length > 0) {
    // 			const item = this.sendCoilQueue.pop()
    // 			const response = await client.writeSingleCoil(item?.register, item?.value == 1 ? true : false)
    // 			this.log.debug("response writeCoil " + JSON.stringify(response))
    // 		}
    // 	})
    // }
    async connect(adapterConfig, callback) {
        const config = adapterConfig;
        return new Promise((resolve, reject) => {
            this.log.debug("connect to host: " + config.hostname);
            this.log.debug("connect to unitId: " + config.unitId);
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            try {
                // create a modbus client
                const netSocket = new net.Socket();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const client = new modbus.client.TCP(netSocket, config.unitId);
                netSocket.connect({
                    "host": config.hostname,
                    "port": config.port,
                    // 'autoReconnect': true,
                    // 'reconnectTimeout': 4000,
                    // 'timeout': 8000,
                });
                netSocket.on("connect", async () => {
                    this.log.debug("connected ...");
                    // call modbus command
                    try {
                        await callback(client);
                        netSocket.end();
                        resolve(self.SolaredgeData);
                    }
                    catch (Exception) {
                        this.log.error("ERROR in callback" + JSON.stringify(Exception));
                        netSocket.end();
                        reject(Exception);
                    }
                });
                netSocket.on("error", (err) => {
                    this.log.error("netSocket ERROR" + JSON.stringify(err));
                    reject(err);
                });
            }
            catch (Exception) {
                this.log.error("ERROR in connect" + JSON.stringify(Exception));
                reject(Exception);
            }
        });
    }
}
exports.SolaredgeTCPModbus = SolaredgeTCPModbus;
//# sourceMappingURL=solaredgeTCPModbus.js.map