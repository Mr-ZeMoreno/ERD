import { EntidadConFisicas } from "./EntidadConFisicas";
import { EntidadDraggleable } from "./EntidadDraggeable";
import type { Entity } from "./Entity";
import { getMousePosition, type Position } from "./utils/eventos";

interface Point {
  x: number;
  y: number;
}

export class Relacion extends EntidadDraggleable {
  public source: Entity;
  public target: Entity;
  public lineWidth: number;
  public diamondColor: string;

  constructor({
    canvas,
    source,
    target,
    diamondColor = "#4CAF50",
    size = 80,
    color = "gray",
    text = "Relación",
    type = "Relación",
    textColor = "black",
    font = "14px Arial",
    lineWidth = 2,
  }: {
    canvas: HTMLCanvasElement;
    source: Entity;
    target: Entity;
    diamondColor?: string;
    offset?: number;
    size?: number;
    color?: string;
    text?: string;
    type?: string;
    textColor?: string;
    font?: string;
    lineWidth?: number;
  }) {
    super({
      x: 0,
      y: 0,
      size,
      text,
      font,
      textColor,
      type,
      color,
      canvas,
    });
    this.source = source;
    this.target = target;
    this.diamondColor = diamondColor;
    this.lineWidth = lineWidth;
    this.offsetX = 50;
    this.offsetY = 50;
  }

  private getConnectionPoints(): { start: Point; end: Point } {
    const start = this.source.getBorderPoint(
      this.target.centerX,
      this.target.centerY
    );
    const end = this.target.getBorderPoint(
      this.source.centerX,
      this.source.centerY
    );
    return { start, end };
  }

  draw(): void {
    if (!this.context) return;
    const { start, end } = this.getConnectionPoints();

    // Calcular punto medio desplazado (posición del diamante)
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    let perpX = 0;
    let perpY = 0;
    if (length !== 0) {
      perpX = -dy / length;
      perpY = dx / length;
    }

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const diamondPoint = {
      x: midX + perpX * this.offsetX,
      y: midY + perpY * this.offsetY,
    };

    // Dibujar primera línea recta (desde la entidad origen al diamante)
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(diamondPoint.x, diamondPoint.y);
    this.context.strokeStyle = this.color;
    this.context.lineWidth = this.lineWidth;
    this.context.stroke();

    // Dibujar segunda línea recta (desde el diamante a la entidad destino)
    this.context.beginPath();
    this.context.moveTo(diamondPoint.x, diamondPoint.y);
    this.context.lineTo(end.x, end.y);
    this.context.strokeStyle = this.color;
    this.context.lineWidth = this.lineWidth;
    this.context.stroke();

    // Dibujar el diamante
    this.drawDiamond(this.context, diamondPoint.x, diamondPoint.y);

    // Configurar y dibujar el texto
    this.context.fillStyle = this.textColor;
    this.context.font = this.font;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this.text, diamondPoint.x, diamondPoint.y);
  }

  private drawDiamond(
    context: CanvasRenderingContext2D,
    x: number,
    y: number
  ): void {
    context.beginPath();
    context.moveTo(x, y - this.size / 2);
    context.lineTo(x + this.size / 2, y);
    context.lineTo(x, y + this.size / 2);
    context.lineTo(x - this.size / 2, y);
    context.closePath();

    context.fillStyle = this.diamondColor;
    context.fill();
    context.strokeStyle = this.color;
    context.lineWidth = this.lineWidth;
    context.stroke();
  }
}
