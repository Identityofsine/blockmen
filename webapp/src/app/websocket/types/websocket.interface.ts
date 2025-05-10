export interface GenericWebSocketPacket {
	type: string;
	data?: unknown;
	error?: unknown;
}
