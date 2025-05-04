type CanvasOpts = {
	dpi: number;
}

class Canvas {
	readonly canvas: HTMLCanvasElement;
	readonly context: CanvasRenderingContext2D;
	readonly opts: CanvasOpts;

	constructor(canvas: HTMLCanvasElement, { dpi }: CanvasOpts) {
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
		const { width, height } = this.canvas.getBoundingClientRect();
		this.canvas.style.width = `${width}px`;
		this.canvas.style.height = `${height}px`;
		this.canvas.width = width * (dpi || 1);
		this.canvas.height = height * (dpi || 1);
		this.opts = { dpi };
	}

	public clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	public drawText(
		text: string,
		x: number,
		y: number,
		fontSize?: number,
		color?: string,
	) {
		x *= this.opts.dpi;
		y *= this.opts.dpi;
		fontSize = (fontSize || 16) * this.opts.dpi;
		this.context.font = `${fontSize}px Arial`;
		if (color) {
			this.context.fillStyle = color;
		} else {
			this.context.fillStyle = "black";
		}
		this.context.fillText(text, x, y);
	}

	public drawCircle(x: number, y: number, radius: number, color: string) {
		x *= this.opts.dpi;
		y *= this.opts.dpi;
		this.context.fillStyle = color;
		this.context.beginPath();
		this.context.arc(x, y, radius, 0, Math.PI * 2);
		this.context.fill();
	}

	public drawLine(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		color: string,
	) {
		//adjusted
		{
			x1 *= this.opts.dpi;
			y1 *= this.opts.dpi;
			x2 *= this.opts.dpi;
			y2 *= this.opts.dpi;
		}
		this.context.strokeStyle = color;
		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.stroke();
	}

	public drawRectangle(
		x: number,
		y: number,
		width: number,
		height: number,
		color: string,
	) {
		x *= this.opts.dpi;
		y *= this.opts.dpi;
		this.context.fillStyle = color;
		this.context.fillRect(x, y, width * this.opts.dpi, height * this.opts.dpi);
	}

	public drawSprite(x: number, y: number, sprite: unknown) {
		x *= this.opts.dpi;
		y *= this.opts.dpi;
		throw new Error("Method not implemented.");
	}
}

export default Canvas;
