// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			hostname: string;
			port: number;
			unitId: number;
			com_wait_pause: number;
			main_loop_pause: number;
			connection_timeout: number
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};