import { EventObject } from "../../events/event";
import { GenericWebSocketPacket } from "../types/websocket.interface";

interface WebsocketInterface {
	sendMessageBackToServer(): void;
}

export class MessageEvent extends EventObject {

	constructor(
		private readonly message: GenericWebSocketPacket,
		private readonly webSocketInterface: WebsocketInterface,
	) {
		super("MessageEvent", message);
	}

	public get data(): GenericWebSocketPacket {
		return this.message;
	}

	public sendMessageBackToServer(msg: GenericWebSocketPacket): void {
		console.log("MessageEvent", msg);
		this.webSocketInterface.sendMessageBackToServer();
	}

}
