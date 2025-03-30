import { EntidadConFisicas } from "./EntidadConFisicas";

export abstract class EntidadDraggleable extends EntidadConFisicas {
  offsetX: number = 0;
  offsetY: number = 0;

  isMouseOver(mouseX: number, mouseY: number): boolean {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.size + this.size / 2 &&
      mouseY >= this.y &&
      mouseY <= this.y + this.size
    );
  }

  updateDrag(
    mouseX: number,
    mouseY: number,
    entities: EntidadConFisicas[]
  ): void {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
      this.keepInBounds();

      for (const entity of entities) {
        if (entity !== this) {
          this.preventOverlap(entity);
          this.applyRepulsion(entity, 5);
        }
      }
    }
  }

  startDrag(mouseX: number, mouseY: number): void {
    this.dragging = true;
    this.offsetX = this.x - mouseX;
    this.offsetY = this.y - mouseY;
  }

  endDrag(): void {
    this.dragging = false;
  }

  getBorderPoint(targetX: number, targetY: number): { x: number; y: number } {
    const centerX = this.centerX;
    const centerY = this.centerY;
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    // Calcular ángulo hacia el punto objetivo
    const angle = Math.atan2(targetY - centerY, targetX - centerX);

    // Calcular intersección con el rectángulo
    const ratio = Math.min(
      Math.abs(halfWidth / Math.cos(angle)),
      Math.abs(halfHeight / Math.sin(angle))
    );

    return {
      x: centerX + Math.cos(angle) * ratio,
      y: centerY + Math.sin(angle) * ratio,
    };
  }
}
