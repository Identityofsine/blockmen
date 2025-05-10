import { EventObject } from "./event";

type EventFunction<T extends EventObject> = (args: T) => unknown;

export abstract class EventfulObject<E extends string = string, K extends Record<E, EventObject> = Record<E, EventObject>> {

	private _events: Map<string, EventFunction<K[E]>[]> = new Map();

	public addEventListener<EV extends E>(event: EV, callback: EventFunction<K[EV]>): void {
		if (!this._events.has(event)) {
			this._events.set(event, []);
		}
		this._events.get(event)?.push(callback as EventFunction<K[E]>);
	}

	public removeEventListener(event: E, callback: EventFunction<K[E]>): void {
		const callbacks = this._events.get(event);
		if (callbacks) {
			this._events.set(event, callbacks.filter((cb) => cb !== callback));
		}
	}

	/**
	 * @description This method is used to emit an event with the given arguments.
	 * @param args - The arguments to be passed to the event handler.
	 */
	protected emit(event: E, eventObject: K[E]): void {
		const callbacks = this._events.get(event);
		if (callbacks) {
			callbacks.forEach((callback) => {
				callback(eventObject);
			});
		}
	}

}
