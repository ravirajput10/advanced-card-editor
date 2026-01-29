// Element Types
export type ElementType = 'text' | 'rect' | 'circle' | 'line' | 'image' | 'icon';

// Base element properties shared by all elements
export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  name: string;
  groupId?: string;
}

// Text element
export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: 'normal' | 'italic';
  fontWeight: 'normal' | 'bold';
  textDecoration: 'none' | 'underline';
  fill: string;
  align: 'left' | 'center' | 'right';
}

// Rectangle element
export interface RectElement extends BaseElement {
  type: 'rect';
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
}

// Circle element
export interface CircleElement extends BaseElement {
  type: 'circle';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

// Line element
export interface LineElement extends BaseElement {
  type: 'line';
  points: number[]; // [x1, y1, x2, y2]
  stroke: string;
  strokeWidth: number;
}

// Image element
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
}

// Icon element (SVG rendered as image)
export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string;
  fill: string;
}

// Union type for all elements
export type CanvasElement =
  | TextElement
  | RectElement
  | CircleElement
  | LineElement
  | ImageElement
  | IconElement;

// Group definition
export interface ElementGroup {
  id: string;
  name: string;
  elementIds: string[];
}

// Snapping guideline
export interface Guideline {
  type: 'horizontal' | 'vertical';
  position: number;
}

// Editor state
export interface EditorState {
  // Canvas
  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;

  // Elements (ordered by z-index, first = bottom, last = top)
  elements: CanvasElement[];

  // Selection
  selectedIds: string[];

  // Groups
  groups: ElementGroup[];

  // UI
  guidelines: Guideline[];
  theme: 'light' | 'dark';

  // Actions
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElements: (ids: string[]) => void;
  setSelection: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  clearSelection: () => void;
  reorderElement: (fromIndex: number, toIndex: number) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  groupElements: (ids: string[]) => void;
  ungroupElements: (groupId: string) => void;
  setGuidelines: (guidelines: Guideline[]) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCanvasBackground: (color: string) => void;
}
