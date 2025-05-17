import Canvas from "../canvas/canvas";
import { Hookable, HookFunction } from "../hook/hook";
import { SceneManager } from "./scene/scenemanager";
import { debugData } from "./ui/debug";

type RendererHookTypes = "ui" | "foreground" | "background";

export type RenderHookArgs = {
	renderer: Renderer;
	//debug data
	frameTime?: number;
};

class Renderer extends Hookable<RendererHookTypes, RenderHookArgs> {
	private readonly canvas: Canvas;
	private fps: number = 0;
	private fpsLastTime: number = 0;
	private frameCount: number = 0;
	private sceneManager: SceneManager;

	constructor(canvas: HTMLCanvasElement, canvasOpts = { dpi: 1 }) {
		super();
		this.sceneManager = new SceneManager(this);
		this.addHook("background", () => {
			this.sceneManager.scene?.renderBackground(this);
		})
		this.addHook("foreground", () => {
			this.sceneManager.scene?.renderForeground(this);
		})
		this.canvas = new Canvas(canvas, canvasOpts);
		this.hookUI(debugData);
		this.render();
	}

	public hookUI(hook: HookFunction<RenderHookArgs>): void {
		this.addHook("ui", hook);
	}

	public hookForeground(hook: HookFunction<RenderHookArgs>): void {
		this.addHook("foreground", hook);
	}

	public hookBackground(hook: HookFunction<RenderHookArgs>): void {
		this.addHook("background", hook);
	}

	public get canvasElement(): Canvas {
		return this.canvas;
	}

	public get context(): CanvasRenderingContext2D {
		return this.canvas.context;
	}

	public get scenes(): SceneManager {
		return this.sceneManager;
	}

	private calculateFramesPerSecond(): number {
		const now = performance.now();
		this.frameCount++;

		// Check if one second has passed to calculate FPS
		if (now - this.fpsLastTime >= 1000) {
			this.fps = this.frameCount;
			this.frameCount = 0; // Reset the frame counter
			this.fpsLastTime = now; // Reset the time for the next second
		}
		return this.fps;
	}

	private render() {
		//render loop, gets call every frame
		const argOpts = {
			renderer: this,
			frameTime: this.calculateFramesPerSecond(),
		}
		this.canvas.clear();
		this.emitHooks("background", argOpts);
		this.emitHooks("foreground", argOpts);
		this.emitHooks("ui", argOpts);
		requestAnimationFrame(() => {
			this.render();
		});
	}
}

export default Renderer;
