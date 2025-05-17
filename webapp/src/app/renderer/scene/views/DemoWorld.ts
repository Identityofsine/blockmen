import Renderer from "../../renderer";
import { Scene } from "../scene";
import { Background } from "../../objects/models/background";
import { Rectangle } from "../../objects/models/rectangle";
import { restrictToArea } from "../utils/restricttoarea";

export class DemoWorld extends Scene {
  constructor() {
    super("DemoWorld");
  }

  renderBackground(renderer: Renderer): void {
    new Background("#282a36").render(renderer);
  }
  renderForeground(renderer: Renderer): void {
    //wall -1
    new Rectangle(0, 0, 250, renderer.canvasElement.height, {
      color: "#44475a",
    }).render(renderer);
    //wall -2
    new Rectangle(
      renderer.canvasElement.width - 250,
      0,
      250,
      renderer.canvasElement.height,
      {
        color: "#44475a",
      },
    ).render(renderer);
    //wall -3
    //floor
    new Rectangle(
      0,
      renderer.canvasElement.height - 250,
      renderer.canvasElement.width,
      250,
      {
        color: "#44475a",
      },
    ).render(renderer);
    //wall -4
    //ceiling
    new Rectangle(0, 0, renderer.canvasElement.width, 250, {
      color: "#44475a",
    }).render(renderer);

    //TODO: handle player movement here.
    this.drawPlayers(renderer);
  }

  drawPlayers(renderer: Renderer): void {
    restrictToArea(
      65,
      65,
      {
        x: 250,
        y: 250,
        width: renderer.canvasElement.width - 250 * 2,
        height: renderer.canvasElement.height - 250 * 2,
      },
      (x, y) => {
        new Rectangle(x, y, 250, 250, {
          color: "#ff79c6",
        }).render(renderer);
      },
    );
  }

  destroy(): void {
    throw new Error("Method not implemented.");
  }
}
