export abstract class EntidadBase {
  protected _size: number;
  protected _text: string;
  protected isEditing: boolean;
  protected _font: string;
  protected _textColor: string;
  protected type: string;
  protected color: string;
  protected context: CanvasRenderingContext2D | null;

  constructor({
    size,
    text = "Objeto",
    isEditing = false,
    font = "14px Arial",
    textColor = "black",
    type = "EntidadBase",
    color = "rgba(100, 100, 255, 0.5)",
    context,
  }: {
    size: number;
    text?: string;
    isEditing?: boolean;
    font?: string;
    textColor?: string;
    type?: string;
    color?: string;
    context: CanvasRenderingContext2D | null;
  }) {
    this._size = size;
    this._text = text;
    this.isEditing = isEditing;
    this._font = font;
    this._textColor = textColor;
    this.type = type;
    this.color = color;
    this.context = context;
  }

  // Getters corregidos (evitando recursión infinita)
  get font(): string {
    return this._font;
  }

  get size(): number {
    return this._size;
  }

  get textColor(): string {
    return this._textColor;
  }

  get text(): string {
    return this._text;
  }

  set size(value: number) {
    this._size = value;
  }

  // Setters útiles para modificación
  set font(value: string) {
    this._font = value;
  }

  set textColor(value: string) {
    this._textColor = value;
  }

  set text(value: string) {
    this._text = value;
  }

  abstract isMouseOver(mouseX: number, mouseY: number): boolean;

  startTextEditing(): void {
    this._text = "";
    this.isEditing = true;
  }

  endTextEditing(newText: string): void {
    this._text = newText;
    this.isEditing = false;
  }

  // Método draw básico (debe ser sobrescrito por clases hijas)
  draw(): void {
    if (!this.context) return;
    this.context.fillStyle = this.color;
    this.context.fillRect(0, 0, this.size, this.size);

    // Texto básico
    this.context.font = this._font;
    this.context.fillStyle = this._textColor;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(this._text, this.size / 2, this.size / 2);
  }

  // Implementación mejorada de setSelectedMode
  setSelectedMode({ state }: { state: boolean }) {
    this.textColor = state ? "red" : "black";
    // // Podrías añadir más indicadores visuales
    // this.borderColor = state ? "red" : "white";
    // this.borderWidth = state ? 3 : 1;
  }
}
