
/**
 * @class RenderStateObject
 * @description This class is a placeholder for the render state object.
 * This object will be used to maintain an objects state and cause re-renders for the UI
 */
export class RenderStateObject<T = unknown> {

	private listeners: ((state: T) => void)[] = [];
	private state: T | null = null;


	public get getState(): T | null {
		return this.state;
	}

	public set setState(state: T) {
		this.state = state;
		this.emit(state);
	}

	public subscribe(callback: (state: T) => void): void {
		this.listeners.push(callback);
	}

	public unsubscribe(callback: (state: T) => void): void {
		this.listeners = this.listeners.filter((cb) => cb !== callback);
	}

	//emitter, when state chanages call this function
	private emit(state: T): void {
		this.listeners.forEach((callback) => {
			callback?.(state);
		});
	}

}
