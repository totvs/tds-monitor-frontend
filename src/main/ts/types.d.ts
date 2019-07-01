interface MonitorSettings {
	servers?: Array<Server>;
}

interface Server {
	name: string;
	address: string;
	port: number;
}
