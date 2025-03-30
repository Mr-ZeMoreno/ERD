import type { EntidadBase } from "./EntidadBase";
import type { EntidadDraggleable } from "./EntidadDraggeable";
import { getMousePosition, type Position } from "./utils/eventos";

export class TextInput {
  private textInput: HTMLInputElement;
  private editedItem: EntidadBase | null = null;
  private canvas: HTMLCanvasElement;
  private getItems: () => EntidadDraggleable[];

  constructor({
    canvas,
    getItems,
  }: {
    canvas: HTMLCanvasElement;
    getItems: () => EntidadDraggleable[];
  }) {
    this.canvas = canvas;
    this.getItems = getItems;
    this.textInput = this.createTextInput();

    this.setupEventListeners();
  }

  private createTextInput(): HTMLInputElement {
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.display = "none";
    input.style.textAlign = "center";
    document.body.appendChild(input);
    return input;
  }

  private setupEventListeners() {
    this.textInput.addEventListener(
      "keydown",
      (e) => e.key === "Enter" && this.handleEditEnd()
    );
    this.textInput.addEventListener("blur", this.handleEditEnd.bind(this));
    this.canvas.addEventListener("dblclick", this.handleDoubleClick.bind(this));
  }

  private handleDoubleClick(event: MouseEvent) {
    const position = getMousePosition({ e: event, canvas: this.canvas });
    this.editarTexto({ position });
  }

  private setupTextInput({
    position,
    text,
    width,
  }: {
    position: Position;
    text: string;
    width?: number;
  }) {
    const { left, top } = this.canvas.getBoundingClientRect();
    this.textInput.value = text;
    this.textInput.style.display = "block";
    this.textInput.style.left = `${position.x + left - (width ?? 100) / 2}px`;
    this.textInput.style.top = `${position.y + top - 10}px`;
    this.textInput.style.width = `${width ?? 100}px`;
    this.textInput.focus();
  }

  private handleEditEnd() {
    if (this.editedItem) {
      this.editedItem.endTextEditing(this.textInput.value);
      this.textInput.style.display = "none";
      this.editedItem = null;
    }
  }

  editarTexto({ position }: { position: Position }) {
    for (const item of this.getItems()) {
      if (item.isMouseOver(position.x, position.y)) {
        this.editedItem = item;
        this.setupTextInput({
          position: { x: item.centerX, y: item.centerY },
          text: item.text,
          width: item.width,
        });
        item.startTextEditing();
        break;
      }
    }
  }
}
