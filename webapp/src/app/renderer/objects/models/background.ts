import Renderer from "../../renderer";
import { RenderObject } from "../types/renderobject";

export class Background extends RenderObject {
  //this class draws a background - solid color, gradient, or image, across the entire canvas
  private backgroundColor: string;

  public constructor(backgroundColor: string) {
    super(0, 0);
    this.backgroundColor = backgroundColor;
  }

  public render(renderer: Renderer): void {
    const { width, height } = renderer.canvasElement;
    renderer.context.fillStyle = this.backgroundColor;
    renderer.context.fillRect(0, 0, width, height);
  }

  public destroy(): void {
    throw new Error("Method not implemented.");
  }
}
