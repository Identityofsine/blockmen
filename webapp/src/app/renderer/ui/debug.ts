import { getBuildConfig } from "../../../util/build";
import { MessageEvent } from "../../websocket/events/messageevent";
import { WebSocketInstance } from "../../websocket/websocket";
import { RenderHookArgs } from "../renderer";

const config = getBuildConfig();
let lastMessage: string | null = null;

WebSocketInstance.getInstance().addEventListener(
  "message",
  (event: MessageEvent) => {
    const data = event.data;
    if (data) {
      lastMessage = (data.data as string) || null;
    }
  },
);

//this is a hook function btw
export function debugData({ renderer, frameTime }: RenderHookArgs) {
  const baseX = 20;
  const baseY = 20;
  const color = "#f1caff";
  renderer.canvasElement.drawText(
    `dev(${config.branch}:${config.buildId}):${config.buildDate}`,
    baseX,
    baseY,
    20,
    "#f1caff",
  );
  renderer.canvasElement.drawText(
    "Frame Time: " + frameTime,
    baseX,
    baseY + 45,
    40,
    "#f1caff",
  );
  renderer.canvasElement.drawText(
    "Last Message: " + (lastMessage || "None"),
    baseX,
    baseY + 90,
    40,
    "#f1caff",
  );

  return;
}
