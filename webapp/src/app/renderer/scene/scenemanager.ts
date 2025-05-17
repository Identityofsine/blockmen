import Renderer from "../renderer";
import { Scene } from "./scene";

export class SceneManager {

	private renderer: Renderer;
	private scenes: Map<string, Scene> = new Map();
	private activeScene: Scene | null = null;

	public constructor(renderer: Renderer) {
		this.renderer = renderer;
	}

	public loadSceneInternally(sceneName: string) {
		const scene = this.scenes.get(sceneName);
		if (!scene) {
			throw new Error(`Scene ${sceneName} not found`);
		}
		this.renderer.canvasElement.clear();
		this.setActiveScene(scene);
	}

	public loadScene(scene: Scene): void {
		if (this.scenes.has(scene.name)) {
			this.setActiveScene(scene);
			return;
		}
		//logic to load the scene
		this.scenes.set(scene.name, scene);
		this.setActiveScene(scene);
	}

	public get scene(): Scene | null {
		return this.activeScene;
	}

	private setActiveScene(scene: Scene): void {
		if (this.activeScene) {
			this.activeScene.destroy();
		}
		this.activeScene = scene;
		this.scenes.set(scene.name, scene);
	}

}
