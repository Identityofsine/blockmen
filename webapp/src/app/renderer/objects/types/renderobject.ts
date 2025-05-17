import Renderer from "../renderer";

/**
 * @class RenderObject
 * @description This class represents a renderable object in the rendering system.
 * It serves as a base class for all renderable objects, providing common properties and methods.
 * That may serve to be useful for the rendering engine to work with.
 *
 */
export abstract class RenderObject {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  public abstract render(renderer: Renderer): void;
  public abstract destroy(): void;
}
