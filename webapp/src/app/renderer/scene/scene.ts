import Renderer from "../renderer";

export abstract class Scene {

	private sceneName: string;

	public constructor(sceneName: string) {
		this.sceneName = sceneName;
	}

	public get name(): string {
		return this.sceneName;
	}

	abstract renderBackground(renderer: Renderer): void;
	abstract renderForeground(renderer: Renderer): void;


	abstract destroy(): void;
}
