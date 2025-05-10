import { EventObject } from "../events/event";
import { MessageEvent } from "./events/messageevent";
import { EventfulObject } from "../events/events";
import { GenericWebSocketPacket } from "./types/websocket.interface";

type WebSocketEvents = {
  open: EventObject;
  close: EventObject;
  message: MessageEvent;
  error: EventObject;
};

export class WebSocketInstance extends EventfulObject<
  keyof WebSocketEvents,
  WebSocketEvents
> {
  private static _instance: WebSocketInstance | null = null;
  private _webSocket: WebSocket | null = null;

  private constructor() {
    super();
  }

  public static getInstance(): WebSocketInstance {
    if (this._instance === null) {
      this._instance = new WebSocketInstance();
    }
    return this._instance;
  }

  private setupWebSocketEvents(): void {
    this._webSocket?.addEventListener("open", (event) => {
      this.emit("open", new EventObject("open", this));
    });
    this._webSocket?.addEventListener("close", (event) => {
      this.emit("close", new EventObject("close", this));
    });
    this._webSocket?.addEventListener("message", (event) => {
      const messageEvent = new MessageEvent(
        {
          type: "message",
          data: event.data,
        },
        {
          sendMessageBackToServer: () => {},
        },
      );
      this.emit("message", messageEvent);
    });
    this._webSocket?.addEventListener("error", (event) => {
      this.emit("error", new EventObject("error", this));
    });
  }

  public connect(): WebSocketInstance {
    this._webSocket = new WebSocket("ws://localhost:9090");
    this.setupWebSocketEvents();

    return this;
  }

  public send(data: GenericWebSocketPacket): void {
    this._webSocket?.send(JSON.stringify(data));
  }
}
