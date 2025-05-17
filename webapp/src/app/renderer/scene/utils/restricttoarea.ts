
/**
 * Restricts the given (x, y) coordinate to the specified rectangular area,
 * then calls the provided callback with the clamped (x, y) values.
 * (x, y) should be the top left corner of the rectangle you want 
 * (x, y) to be restricted in.
 *
 * @param x - The x coordinate to restrict.
 * @param y - The y coordinate to restrict.
 * @param area - The rectangular area to restrict to.
 * @param callback - A function to call with the restricted (x, y).
 *
 */
export function restrictToArea(
	x: number,
	y: number,
	area: { x: number; y: number; width: number; height: number },
	callback: (x: number, y: number) => void
): void {
	const clampedX = Math.max(area.x, Math.min(x + area.x, area.x + area.width));
	const clampedY = Math.max(area.y, Math.min(y + area.y, area.y + area.height));

	callback(clampedX, clampedY);
}
