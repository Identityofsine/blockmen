import Renderer from "../renderer";

//this is a hook function btw
export function debugData(renderer: Renderer) {
  renderer.canvasElement.drawText("Debug", 11, 10, 20, "red");
  return;
}
