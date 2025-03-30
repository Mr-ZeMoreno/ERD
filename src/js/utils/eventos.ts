export function getMousePosition({
  e,
  canvas,
}: {
  e: MouseEvent;
  canvas: HTMLCanvasElement;
}): Position {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  return { x, y };
}

export interface Position {
  x: number;
  y: number;
}
