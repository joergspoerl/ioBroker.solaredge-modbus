/*
 * Created with @iobroker/create-adapter v2.0.2
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import { SolaredgeDataEntry } from "./solaredge/solaredgeModel";
import { SolaredgeTCPModbus } from "./solaredge/solaredgeTCPModbus";
import { splitIdFromAdapter } from "./solaredge/solaredgeUtil";

// Load your modules here, e.g.:
// import * as fs from "fs";

class SolaredgeModbus extends utils.Adapter {

	solaredge : SolaredgeTCPModbus | undefined
	mainLoopRunning = true

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "solaredge-modbus",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// Initialize your adapter here

		this.solaredge = new SolaredgeTCPModbus(this.log)

		this.initObjects();


		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		this.subscribeStates("control.*");
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates("lights.*");
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates("*");

		this.mainLoop();

	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);
			this.mainLoopRunning = false

			callback();
		} catch (e) {
			callback();
		}
	}


	private async initObjects(): Promise<void> {
		if (this.solaredge) {
			for (const [key, value] of Object.entries(this.solaredge.SolaredgeData)) {
				const v = value as SolaredgeDataEntry
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

	private async mainLoop(): Promise<void> {
		while(this.mainLoopRunning) {
			await this.updateStates();
			this.log.debug("sleep: " + this.config.interval * 1000)
			await this.sleep(this.config.interval * 1000)

			// console.log("sleep debug: ", this.config.interval * 1000 * 1000)
			// await this.sleep(this.config.interval * 1000 * 1000) /* DEBUG */
		}
	}

	private async sleep(ms:number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private async updateStates(): Promise<void> {
		try {
			if (this.solaredge) {

				this.log.debug("writeHoldingRegister start")
				await this.solaredge.writeHoldingRegister(this.config)
				await this.sleep(1000)
				this.log.debug("writeHoldingRegister end")

				await this.solaredge.readHoldingRegister(this.config)

				for (const [key, value] of Object.entries(this.solaredge.SolaredgeData)) {
					const v = value as SolaredgeDataEntry;
					if (true || v.value !== v.valueOld) {
						// this.log.debug("key     : " + key)
						// this.log.debug("value   : " + v.value)
						// this.log.debug("valueOld: " + v.valueOld)
						await this.setStateAsync(key, {
							val: v.value,
							ack: true
						});
					}
				}
			}
		} catch (Exception) {
			this.log.error("ERROR updateStates in  solaredge.readHoldingRegister: " + JSON.stringify(Exception))
		}

	}


	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  */
	// private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		try {
			if (state) {
				// The state was changed
				this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);


				const v = this.solaredge?.SolaredgeData[splitIdFromAdapter(id)];
				this.log.debug("onStateChange" + JSON.stringify(v))
				if (v && v.writeRegister && state.ack == false) {
					const queueEntry = v.writeRegister({
						value: state.val,
					});
					this.solaredge?.sendHoldingRegisterQueue.push(queueEntry);
					// await this.solaredge?.writeHoldingRegister(this.config);
				}

				// else {
				// 	if (v.writeCoil) {
				// 		twd.value = state.val;
				// 		const twc = v.writeCoil(twd);
				// 		this.tristar.sendCoilQueue.push(twc)
				// 		await this.tristar.writeCoil(this.config)
				// 	} else {
				// 		this.log.error("Model has nor function writeCoil or write Register !!! ")
				// 	}
				// }
			} else {
				// The state was deleted
				this.log.info(`state ${id} deleted`);
			}
		} catch (Exception) {
			this.log.error("onStateChange" + JSON.stringify(Exception))
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  */
	// private onMessage(obj: ioBroker.Message): void {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }

}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new SolaredgeModbus(options);
} else {
	// otherwise start the instance directly
	(() => new SolaredgeModbus())();
}