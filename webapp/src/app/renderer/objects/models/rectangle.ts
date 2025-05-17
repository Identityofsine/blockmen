import Renderer from "../../renderer";
import { RenderShape } from "../types/rendershape";

export class Rectangle extends RenderShape {

	drawShape(renderer: Renderer): void {
		renderer.context.fillRect(this.x, this.y, this.width, this.height);
	}

	public destroy(): void {
		throw new Error("Method not implemented.");
	}
}
