import Renderer from "../../renderer";
import { RenderObject } from "./renderobject";

type ShapeOpts = {
  color?: string;
  rotation?: number;
};

export abstract class RenderShape extends RenderObject {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number,
    public readonly opts: ShapeOpts = {},
  ) {
    super(x, y);
  }

  public render(renderer: Renderer) {
    const { x, y, width, height } = this;
    const { color, rotation } = this.opts;

    if (color) {
      renderer.context.fillStyle = color;
    }

    if (rotation) {
      renderer.context.save();
      renderer.context.translate(x + width / 2, y + height / 2);
      renderer.context.rotate(rotation);
      renderer.context.translate(-x - width / 2, -y - height / 2);
    }

    this.drawShape(renderer);

    if (rotation) {
      renderer.context.restore();
    }
  }

  abstract drawShape(renderer: Renderer): void;
}
