# Advanced Card Editor

A powerful, feature-rich card design editor built with React, TypeScript, and Konva.js.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4-teal)

## Features

### 🎨 Canvas & Elements
- **600×350 canvas** with customizable background color
- **Multiple element types**: Text, Rectangle, Circle, Line, Image, Icon
- **50+ Lucide icons** available in the icon picker
- **Drag, resize, rotate** any element with intuitive controls

### ✏️ Editing
- **Double-click text** for inline editing
- **Properties Panel** with type-specific controls:
  - Text: font, size, color, bold/italic/underline, alignment
  - Shapes: fill, stroke, corner radius
  - Images: replace, crop, flip horizontal/vertical
  - Icons: color picker
- **Layer Panel** with drag-to-reorder, visibility toggles, lock controls

### 🎯 Precision Tools
- **Smart snapping** to canvas edges, center, and other elements
- **Visual guidelines** appear during drag operations
- **Group/Ungroup** multiple elements together

### 🔍 Navigation
- **Mouse wheel zoom** (10% - 300%)
- **Zoom controls** in toolbar (+, -, reset)
- **Pan support** with zoom

### 📤 Export
- **PNG** with transparency (2x resolution)
- **JPEG** with configurable quality
- **PDF** print-ready document

### 🎭 Templates
- **4 pre-designed templates** to get started quickly
- Blank, Modern Business, Dark Minimal, Gradient Wave

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+G` | Group selected elements |
| `Ctrl+Shift+G` | Ungroup selected elements |
| `Delete` | Delete selected |
| `Ctrl+A` | Select all |
| `Arrow keys` | Move selected (1px) |
| `Shift+Arrow` | Move selected (10px) |

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management with undo/redo
- **Konva.js** - Canvas rendering
- **jsPDF** - PDF export
- **@dnd-kit** - Drag and drop for layer reordering

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

## Project Structure

```
src/
├── components/
│   ├── canvas/          # EditorCanvas, Guidelines
│   ├── elements/        # RectNode, CircleNode, TextNode, etc.
│   ├── layout/          # EditorLayout, ThemeToggle
│   ├── panels/          # Toolbar, LayerPanel, PropertiesPanel
│   └── ui/              # shadcn/ui components
├── data/
│   └── templates.ts     # Card templates
├── hooks/
│   ├── useKeyboard.ts   # Keyboard shortcuts
│   ├── useSnapping.ts   # Smart snapping
│   └── useExport.ts     # Export functionality
├── lib/
│   └── stageRef.ts      # Global stage reference
├── store/
│   ├── types.ts         # TypeScript types
│   └── useEditorStore.ts # Zustand store
└── App.tsx
```

## Implementation Details

### State Management (Zustand)

We chose **Zustand** for its simplicity and excellent performance:

```typescript
// Central store with persistence & undo/redo support
export const useEditorStore = create<EditorState>()(
  persist(
    temporal(
      (set, get) => ({
        elements: [],
        selectedIds: [],
        // ... actions
      }),
      { limit: 50 } // Undo/redo history limit
    ),
    {
      name: 'advanced-card-editor-v1',
      storage: createJSONStorage(() => localStorage),
      // ... partialization
    }
  )
);
```

**Why Zustand?**
- **Minimal boilerplate**: No need for actions/reducers like Redux.
- **Persistence**: Built-in `persist` middleware for automatic `localStorage` saving (PWA friendly).
- **Temporal State**: Seamless integration with `zundo` for 50-step undo/redo history.
- **Performance**: Subscription-based updates prevent unnecessary re-renders of the entire app.

### Snapping & Alignment

The editor implements two types of snapping:
1. **Magnet Snapping**: Elements snap to canvas edges, center points, and other elements (edges/centers).
2. **Grid Snapping**: Elements snap to a customizable grid (default 20px) when enabled.

```typescript
// useSnapping.ts logic
const result = getSnapPosition(
    elementId, x, y, width, height,
    snapToGrid, gridSize
);
// Returns snapped x/y and vertical/horizontal guideline arrays
```

Guidelines are rendered as high-visibility red lines using Konva `Line` shapes, wrapped in a dedicated `Group` for easy visibility management.

### Undo/Redo

Implemented using `zundo`, a Zustand middleware for temporal state:

```typescript
import { temporal } from 'zundo';

// Wraps the store to track state changes
const store = create(temporal(storeConfig, { limit: 50 }));

// Access undo/redo from temporal store
const { undo, redo, pastStates, futureStates } = useTemporalStore();
```

Every state mutation is automatically tracked, allowing 50 steps of history.

### Export System

The export logic in `Toolbar.tsx` ensures professional results:

1. **Format Support**: Export to PNG (2x scale), JPEG (quality 0.92), and multi-page PDF (via `jsPDF`).
2. **Clean Captures**: Using Konva's `stage.findOne('#id')`, we temporarily hide UI elements (`#selection-transformer`, `#canvas-grid`, `#snap-guidelines`) before capture and restore them immediately after.
3. **Perfect Clipping**: All exports are strictly clipped to the `600x350` canvas bounds, regardless of the user's current zoom or pan position.

```typescript
const dataUrl = stage.toDataURL({
    x: 0, y: 0, width: 600, height: 350, // Clip to bounds
    pixelRatio: 2,
    mimeType: 'image/png'
});
```

### Performance Optimizations

1. **React.memo on all element components** - Prevents re-renders when other elements change
2. **Zustand selectors** - Components only subscribe to the state they need
3. **useCallback/useMemo** - Memoized event handlers and computed values
4. **Konva layer batching** - `layerRef.current.batchDraw()` for grouped updates

```typescript
// Example: Only re-render when this specific element changes
const RectNode = memo(function RectNode({ element, ...props }) {
  // Component only renders when element prop changes
});
```

## License

MIT
