import { getBuildConfig } from "../../util/build";
import Canvas from "../canvas/canvas";
import { Hookable, HookFunction } from "../hook/hook";
import { debugData } from "./ui/debug";

type RendererHookTypes = "ui" | "foreground" | "background";

class Renderer extends Hookable<RendererHookTypes, Renderer> {
  private readonly canvas: Canvas;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = new Canvas(canvas);
    const config = getBuildConfig();
    if (config.branch === "local" || config.branch === "dev") {
      this.hookUI(debugData);
    }
    this.render();
  }

  public hookUI(hook: HookFunction<Renderer>): void {
    this.addHook("ui", hook);
  }

  public hookForeground(hook: HookFunction<Renderer>): void {
    this.addHook("foreground", hook);
  }

  public hookBackground(hook: HookFunction<Renderer>): void {
    this.addHook("background", hook);
  }

  public get canvasElement(): Canvas {
    return this.canvas;
  }

  public get context(): CanvasRenderingContext2D {
    return this.canvas.context;
  }

  private render() {
    //render loop, gets call every frame
    this.emitHooks("ui", this);
    this.emitHooks("foreground", this);
    this.emitHooks("background", this);
    requestAnimationFrame(() => {
      this.render();
    });
  }
}

export default Renderer;
