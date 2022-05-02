"use strict";
/*
 * Created with @iobroker/create-adapter v2.0.2
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = __importStar(require("@iobroker/adapter-core"));
const solaredgeTCPModbus_1 = require("./solaredge/solaredgeTCPModbus");
const solaredgeUtil_1 = require("./solaredge/solaredgeUtil");
// Load your modules here, e.g.:
// import * as fs from "fs";
class SolaredgeModbus extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: "solaredge-modbus",
        });
        this.mainLoopRunning = true;
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("objectChange", this.onObjectChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Initialize your adapter here
        this.solaredge = new solaredgeTCPModbus_1.SolaredgeTCPModbus(this.log);
        this.initObjects();
        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        this.subscribeStates("control.*");
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates("lights.*");
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates("*");
        this.startWatchDog();
        this.mainLoop();
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);
            this.mainLoopRunning = false;
            callback();
        }
        catch (e) {
            callback();
        }
    }
    async initObjects() {
        await this.initConnectionInfoObject();
        if (this.solaredge) {
            for (const [key, value] of Object.entries(this.solaredge.SolaredgeData)) {
                const v = value;
                await this.setObjectNotExistsAsync(key, {
                    type: "state",
                    common: {
                        name: v.descr,
                        type: v.type,
                        role: "state",
                        read: true,
                        write: v.writeRegister ? true : false,
                        unit: v.unit,
                        states: v.states
                    },
                    native: {},
                });
            }
        }
    }
    async mainLoop() {
        this.log.debug("mainloop: start");
        while (this.mainLoopRunning) {
            this.log.debug("mainloop: while");
            await this.updateStates();
            this.log.debug("sleep: " + this.config.interval * 1000);
            await this.sleep(this.config.interval * 1000);
            // console.log("sleep debug: ", this.config.interval * 1000 * 1000)
            // await this.sleep(this.config.interval * 1000 * 1000) /* DEBUG */
        }
        this.log.debug("mainloop: end");
    }
    async startWatchDog() {
        setInterval(async () => {
            if (this.solaredge) {
                const timeDiff = (Date.now() - this.solaredge.lastConnectedTimestamp);
                if (this.solaredge.lastConnectedTimestamp == 0 || timeDiff > 10000) {
                    this.solaredge.connectionErrorCounter++;
                    this.log.warn("setInfoConnectionState: false - connection lost ! connectionErrorCounter:" + this.solaredge.connectionErrorCounter);
                    await this.setInfoConnectionState(false);
                    if (this.solaredge.connectionErrorCounter > 10) {
                        this.restart();
                    }
                }
                else {
                    this.solaredge.connectionErrorCounter = 0;
                    this.log.debug("setInfoConnectionState: true - connection ok");
                    await this.setInfoConnectionState(true);
                }
            }
            else {
                this.log.warn("setInfoConnectionState: false - connection lost ! - this.solaredge == null");
                await this.setInfoConnectionState(false);
                this.restart();
            }
        }, 5000);
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async updateStates() {
        try {
            if (this.solaredge) {
                await this.solaredge.readAndWrite(this.config);
                // await this.setInfoConnectionState(true);
                for (const [key, value] of Object.entries(this.solaredge.SolaredgeData)) {
                    const v = value;
                    if (v.value !== v.valueOld) {
                        // this.log.debug("key     : " + key)
                        // this.log.debug("value   : " + v.value)
                        // this.log.debug("valueOld: " + v.valueOld)
                        this.log.debug("setState: " + key + " : " + v.value);
                        await this.setStateAsync(key, {
                            val: v.value,
                            ack: true
                        });
                    }
                }
            }
        }
        catch (Exception) {
            // await this.setInfoConnectionState(false);
            if (this.solaredge) {
                this.solaredge.lastConnectedTimestamp = 0;
            }
            this.log.error("ERROR - " + JSON.stringify(Exception));
        }
    }
    /**
     * Is called if a subscribed state changes
     */
    onStateChange(id, state) {
        var _a, _b;
        try {
            if (state) {
                // The state was changed
                this.log.debug(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
                const v = (_a = this.solaredge) === null || _a === void 0 ? void 0 : _a.SolaredgeData[(0, solaredgeUtil_1.splitIdFromAdapter)(id)];
                this.log.debug("onStateChange" + JSON.stringify(v));
                if (v && v.writeRegister && state.ack == false) {
                    const queueEntry = v.writeRegister({
                        value: state.val,
                    });
                    (_b = this.solaredge) === null || _b === void 0 ? void 0 : _b.sendHoldingRegisterQueue.push(queueEntry);
                    // await this.solaredge?.writeHoldingRegister(this.config);
                }
            }
            else {
                // The state was deleted
                this.log.debug(`state ${id} deleted`);
            }
        }
        catch (Exception) {
            this.log.error("onStateChange" + JSON.stringify(Exception));
        }
    }
    async initConnectionInfoObject() {
        await this.setObjectNotExistsAsync("info.connection", {
            _id: "info.connection",
            type: "state",
            common: {
                role: "indicator.connected",
                name: "If communication with circuit works",
                type: "boolean",
                read: true,
                write: false,
                def: false,
            },
            native: {},
        });
    }
    async setInfoConnectionState(state) {
        await this.setStateAsync("info.connection", state, true);
    }
}
if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options) => new SolaredgeModbus(options);
}
else {
    // otherwise start the instance directly
    (() => new SolaredgeModbus())();
}
//# sourceMappingURL=main.js.map