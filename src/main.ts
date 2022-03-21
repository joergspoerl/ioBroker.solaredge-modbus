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

				await this.solaredge.readAndWrite(this.config)

				for (const [key, value] of Object.entries(this.solaredge.SolaredgeData)) {
					const v = value as SolaredgeDataEntry;
					if (v.value !== v.valueOld) {
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



	/**
	 * Is called if a subscribed state changes
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		try {
			if (state) {
				// The state was changed
				this.log.debug(`state ${id} changed: ${state.val} (ack = ${state.ack})`);


				const v = this.solaredge?.SolaredgeData[splitIdFromAdapter(id)];
				this.log.debug("onStateChange" + JSON.stringify(v))
				if (v && v.writeRegister && state.ack == false) {
					const queueEntry = v.writeRegister({
						value: state.val,
					});
					this.solaredge?.sendHoldingRegisterQueue.push(queueEntry);
					// await this.solaredge?.writeHoldingRegister(this.config);
				}

			} else {
				// The state was deleted
				this.log.debug(`state ${id} deleted`);
			}
		} catch (Exception) {
			this.log.error("onStateChange" + JSON.stringify(Exception))
		}
	}

}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new SolaredgeModbus(options);
} else {
	// otherwise start the instance directly
	(() => new SolaredgeModbus())();
}