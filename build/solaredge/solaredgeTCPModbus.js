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
        this.lastConnectedTimestamp = 0;
        this.connectionErrorCounter = 0;
        this.log = log;
        this.log.debug("solaredgeTCPModbus constructor");
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
        const com_wait_pause = 100; // ms
        await this.connect(adapterConfig, async (client) => {
            while (this.sendHoldingRegisterQueue.length > 0) {
                const item = this.sendHoldingRegisterQueue.pop();
                this.log.debug("request writeSingleRegister " + JSON.stringify(item));
                const response = await client.writeMultipleRegisters(item === null || item === void 0 ? void 0 : item.register, item === null || item === void 0 ? void 0 : item.value);
                this.log.debug("response writeSingleRegister " + JSON.stringify(response));
                await this.sleep(com_wait_pause);
            }
            await this.readHoldingRegisterBlock(client, 0, 111); // sun-spec block
            await this.sleep(com_wait_pause);
            await this.readHoldingRegisterBlock(client, 0xE004, 0xE012 - 0xE004); // control block
            await this.sleep(com_wait_pause);
            await this.readHoldingRegisterBlock(client, 0xE100, 0xE16C - 0xE100); // battery1 block1
            await this.sleep(com_wait_pause);
            await this.readHoldingRegisterBlock(client, 0xE16C, 0xE19A - 0xE16C); // battery1 block2
            await this.sleep(com_wait_pause);
            await this.readHoldingRegisterBlock(client, 40123, 40226 - 40123); // meter 1 block1
            await this.sleep(com_wait_pause);
            await this.readHoldingRegisterBlock(client, 40227, 40294 - 40227); // meter 1 block2
            await this.sleep(com_wait_pause);
            await this.updateSolaredgeData(this.buf);
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
    async connect(adapterConfig, callback) {
        const config = adapterConfig;
        return new Promise((resolve, reject) => {
            // this.log.debug("connect to host: " + config.hostname)
            // this.log.debug("connect to unitId: " + config.unitId)
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            const timeoutRef = setTimeout(() => {
                this.log.error("ERROR: Connection timeout");
                reject("ERROR: Connection timeout");
            }, 1000);
            try {
                // create a modbus client
                const netSocket = new net.Socket();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const client = new modbus.client.TCP(netSocket, config.unitId);
                netSocket.on("connect", async () => {
                    // this.log.debug("connected ...")
                    // call modbus command
                    try {
                        self.lastConnectedTimestamp = Date.now();
                        clearTimeout(timeoutRef);
                        await callback(client);
                        netSocket.end();
                        resolve(self.SolaredgeData);
                    }
                    catch (Exception) {
                        clearTimeout(timeoutRef);
                        this.log.error("ERROR in callback" + JSON.stringify(Exception));
                        netSocket.end();
                        reject(Exception);
                    }
                });
                netSocket.on("error", (err) => {
                    clearTimeout(timeoutRef);
                    this.log.error("netSocket ERROR" + JSON.stringify(err));
                    reject(err);
                });
                netSocket.connect({
                    "host": config.hostname,
                    "port": config.port,
                    // "autoReconnect": false,
                    // "reconnectTimeout": 4000,
                    "timeout": 1000,
                });
            }
            catch (Exception) {
                clearTimeout(timeoutRef);
                this.log.error("ERROR in connect" + JSON.stringify(Exception));
                reject(Exception);
            }
        });
    }
}
exports.SolaredgeTCPModbus = SolaredgeTCPModbus;
//# sourceMappingURL=solaredgeTCPModbus.js.map