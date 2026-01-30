# Advanced Card Editor

A powerful, feature-rich card design editor built with React, TypeScript, and Konva.js.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4-teal)

## Features

### 🎨 Canvas & Elements
- **600×350 canvas** with customizable background color
- **Multiple element types**: Text, Rectangle, Circle, Line, Image, Icon
- **40+ Lucide icons** available in the icon picker
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

## License

MIT
