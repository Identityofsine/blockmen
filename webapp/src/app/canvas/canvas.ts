class Canvas {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
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
    if (fontSize) {
      this.context.font = `${fontSize}px Arial`;
    } else {
      this.context.font = "16px Arial";
    }
    if (color) {
      this.context.fillStyle = color;
    } else {
      this.context.fillStyle = "black";
    }
    this.context.fillText(text, x, y);
  }

  public drawCircle(x: number, y: number, radius: number, color: string) {
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
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }

  public drawSprite(x: number, y: number, sprite: unknown) {
    throw new Error("Method not implemented.");
  }
}

export default Canvas;
