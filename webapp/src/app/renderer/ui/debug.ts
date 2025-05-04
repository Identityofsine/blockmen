import { getBuildConfig } from "../../../util/build";
import { RenderHookArgs } from "../renderer";


const config = getBuildConfig();

//this is a hook function btw
export function debugData({ renderer, frameTime }: RenderHookArgs) {
	const baseX = 20;
	const baseY = 20;
	const color = "#f1caff"
	renderer.canvasElement.drawText(`dev(${config.branch}:${config.buildId}):${config.buildDate}`, baseX, baseY, 20, "#f1caff");
	renderer.canvasElement.drawText("Frame Time: " + frameTime, baseX, baseY + 45, 40, "#f1caff");
	console.log(color)
}
