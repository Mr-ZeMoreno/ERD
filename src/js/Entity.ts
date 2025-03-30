import { EntidadConFisicas } from "./EntidadConFisicas";
import { EntidadDraggleable } from "./EntidadDraggeable";
import { Relacion } from "./Relacion";
import { getMousePosition, type Position } from "./utils/eventos";

export class Entity extends EntidadDraggleable {
  protected relationshipState: () => {
    isInRelacionMode: boolean;
    selectedEntity: Entity | null;
  };
  protected entities: () => Entity[];
  protected relaciones: () => Relacion[];

  connections: Relacion[] = [];
  constructor({
    x,
    y,
    size,
    text = "Entidad",
    color = "rgba(100, 100, 255, 0.5)",
    font = "14px Arial",
    textColor = "black",
    type = "EntidadBase",
    relationshipState,
    entities,
    relaciones,
    canvas,
  }: {
    x: number;
    y: number;
    size: number;
    text?: string;
    color?: string;
    font?: string;
    textColor?: string;
    type?: string;
    relationshipState: () => {
      isInRelacionMode: boolean;
      selectedEntity: Entity | null;
    };
    entities: () => Entity[];
    relaciones: () => Relacion[];
    canvas: HTMLCanvasElement;
  }) {
    super({
      x,
      y,
      size,
      text,
      font,
      textColor,
      type,
      color,
      canvas,
    });

    this.relationshipState = relationshipState;
    this.entities = entities;
    this.relaciones = relaciones;

    this.setupEventListeners();
  }

  draw(): void {
    if (!this.context) return;

    this.context.fillStyle = this.dragging
      ? "rgba(255, 100, 100, 0.5)"
      : this.color;
    this.context.strokeStyle = this.dragging ? "red" : "white";
    this.context.lineWidth = 2;

    this.context.beginPath();
    this.context.rect(this.x, this.y, this.width, this.height);
    this.context.fill();
    this.context.stroke();

    this.context.font = this.font;
    this.context.fillStyle = this.textColor;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this.text, this.centerX, this.centerY);
  }

  setupEventListeners() {
    const canvas = this.canvas;

    canvas.addEventListener("click", (e) => {
      let relationshipState = this.relationshipState();
      let entities = this.entities();
      let relaciones = this.relaciones();

      let position = getMousePosition({ e, canvas });
      let clickedEntity = entities.find((entity) =>
        entity.isMouseOver(position.x, position.y)
      );

      if (!relationshipState.isInRelacionMode) return;
      if (!clickedEntity) return;

      // Primera selección
      if (!relationshipState.selectedEntity) {
        relationshipState.selectedEntity = clickedEntity;
        clickedEntity.setSelectedMode({ state: true });
        return;
      }

      // Evitar auto-conexiones
      if (relationshipState.selectedEntity === clickedEntity) return;

      // Verificar si ya existe una relación entre estas entidades
      const existingRelations = relaciones.filter(
        (r) =>
          (r.source === relationshipState.selectedEntity &&
            r.target === clickedEntity) ||
          (r.source === clickedEntity &&
            r.target === relationshipState.selectedEntity)
      ).length;

      // Crear la nueva relación
      const newRel = new Relacion({
        source: relationshipState.selectedEntity,
        target: clickedEntity,
        text: `Rel ${existingRelations + 1}`,
        canvas,
      });

      relaciones.push(newRel);
      relationshipState.selectedEntity.connections.push(newRel);

      // Resetear estado
      relationshipState.selectedEntity.setSelectedMode({ state: false });
      relationshipState.isInRelacionMode = false;
      relationshipState.selectedEntity = null;
    });
  }
}

export function addNewEntity({
  canvas,
  entities,
  relaciones,
  relationshipState,
}: {
  canvas: HTMLCanvasElement;
  entities: () => Entity[];
  relaciones: () => Relacion[];
  relationshipState: () => {
    isInRelacionMode: boolean;
    selectedEntity: Entity | null;
  };
}) {
  const newEntity = new Entity({
    x: Math.random() * canvas.width * 0.7,
    y: Math.random() * canvas.height * 0.7,
    size: 80,
    entities,
    relaciones,
    relationshipState,
    canvas,
  });
  entities().push(newEntity);
}
