export type HookFunction<T = unknown, R = unknown> = (...args: T[]) => R;

export abstract class Hookable<
  T extends string = string,
  HFT = unknown,
  HFR = unknown,
> {
  private hooks: Map<T, HookFunction<HFT, HFR>[]> = new Map();

  protected constructor() {}

  protected addHook(name: T, hook: HookFunction<HFT, HFR>): void {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, []);
    }
    this.hooks.get(name)?.push(hook);
  }

  protected removeHook(name: T, hook: HookFunction<HFT, HFR>): void {
    if (this.hooks.has(name)) {
      const hooks = this.hooks.get(name);
      if (hooks) {
        this.hooks.set(
          name,
          hooks.filter((h) => h !== hook),
        );
      }
    }
  }

  /**
   * @name emitHooks
   * @description Emit hooks with the given name and arguments.
   * @returns An array of results from the hooks that can be processed.
   */
  protected emitHooks(name: T, ...args: HFT[]): HFR[] {
    return this.hooks.get(name)?.map((hook) => hook(...args)) || [];
  }
}
