import { EntidadBase } from "./EntidadBase";

export abstract class EntidadConFisicas extends EntidadBase {
  protected x: number;
  protected y: number;
  protected forceMultiplier: number = 1;
  protected repelForce: number = 5;
  protected dragging: boolean = false;

  protected canvas: HTMLCanvasElement;

  constructor({
    canvas,
    x,
    y,
    size,
    text = "Entidad",
    color = "rgba(100, 100, 255, 0.5)",
    font = "14px Arial",
    textColor = "black",
    type = "EntidadBase",
  }: {
    canvas: HTMLCanvasElement;
    x: number;
    y: number;
    size: number;
    text: string;
    color: string;
    font: string;
    textColor: string;
    type: string;
  }) {
    super({ size, text, font, textColor, type, color, context: null });
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  get width(): number {
    return this.size + this.size / 2;
  }

  get height(): number {
    return this.size;
  }

  get centerX(): number {
    return this.x + this.width / 2;
  }

  get centerY(): number {
    return this.y + this.height / 2;
  }

  checkCollision(other: EntidadConFisicas): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  preventOverlap(other: EntidadConFisicas): void {
    if (this.checkCollision(other)) {
      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) return;

      const directionX = dx / distance;
      const directionY = dy / distance;
      const overlap = (this.size + other.size) * 0.8 - distance;

      if (!this.dragging) {
        this.x -= directionX * overlap * 0.5;
        this.y -= directionY * overlap * 0.5;
        this.keepInBounds();
      }
      if (!other.dragging) {
        other.x += directionX * overlap * 0.5;
        other.y += directionY * overlap * 0.5;
        other.keepInBounds();
      }
    }
  }

  // Aplica repulsión entre entidades cercanas, pa que cachí nomas como trabajamo acá
  applyRepulsion(other: EntidadConFisicas, forceMultiplier?: number): void {
    if (this.dragging && other.dragging) return;
    if (forceMultiplier) this.forceMultiplier = forceMultiplier;

    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (this.size + other.size) * 1;

    if (distance < minDistance && distance > 0) {
      const force =
        ((minDistance - distance) / minDistance) *
        this.repelForce *
        this.forceMultiplier;
      const forceX = (dx / distance) * force;
      const forceY = (dy / distance) * force;

      if (!this.dragging) {
        this.x -= forceX;
        this.y -= forceY;
        this.keepInBounds();
      }
      if (!other.dragging) {
        other.x += forceX;
        other.y += forceY;
        other.keepInBounds();
      }
    }
  }

  // Mantiene la entidad dentro de los límites del canvas
  keepInBounds(margin: number = 0): void {
    this.x = Math.max(
      margin,
      Math.min(this.canvas.width - this.width - margin, this.x)
    );
    this.y = Math.max(
      margin,
      Math.min(this.canvas.height - this.height - margin, this.y)
    );
  }
}
