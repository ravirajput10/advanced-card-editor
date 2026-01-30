import { create } from 'zustand';
import { temporal } from 'zundo';
import type {
  EditorState,
  CanvasElement,
  Guideline,
  ElementGroup,
} from './types';

// Generate unique ID
const generateId = () => `element-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Create store with undo/redo support (20 steps)
export const useEditorStore = create<EditorState>()(
  temporal(
    (set, get) => ({
      // Canvas defaults
      canvasWidth: 600,
      canvasHeight: 350,
      canvasBackground: '#ffffff',

      // Zoom & Pan
      zoom: 1,
      panX: 0,
      panY: 0,

      // Elements
      elements: [],

      // Selection
      selectedIds: [],

      // Groups
      groups: [],

      // UI
      guidelines: [],
      theme: 'dark',

      // Actions
      addElement: (element: CanvasElement) => {
        set((state) => ({
          elements: [...state.elements, { ...element, id: element.id || generateId() }],
        }));
      },

      updateElement: (id: string, updates: Partial<CanvasElement>) => {
        set((state) => ({
          elements: state.elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
          ),
        }));
      },

      deleteElements: (ids: string[]) => {
        set((state) => ({
          elements: state.elements.filter((el) => !ids.includes(el.id)),
          selectedIds: state.selectedIds.filter((id) => !ids.includes(id)),
        }));
      },

      setSelection: (ids: string[]) => {
        set({ selectedIds: ids });
      },

      addToSelection: (id: string) => {
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds
            : [...state.selectedIds, id],
        }));
      },

      clearSelection: () => {
        set({ selectedIds: [] });
      },

      reorderElement: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const elements = [...state.elements];
          const [moved] = elements.splice(fromIndex, 1);
          elements.splice(toIndex, 0, moved);
          return { elements };
        });
      },

      bringForward: (id: string) => {
        set((state) => {
          const index = state.elements.findIndex((el) => el.id === id);
          if (index === -1 || index === state.elements.length - 1) return state;
          const elements = [...state.elements];
          [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
          return { elements };
        });
      },

      sendBackward: (id: string) => {
        set((state) => {
          const index = state.elements.findIndex((el) => el.id === id);
          if (index <= 0) return state;
          const elements = [...state.elements];
          [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
          return { elements };
        });
      },

      bringToFront: (id: string) => {
        set((state) => {
          const index = state.elements.findIndex((el) => el.id === id);
          if (index === -1 || index === state.elements.length - 1) return state;
          const elements = [...state.elements];
          const [moved] = elements.splice(index, 1);
          elements.push(moved);
          return { elements };
        });
      },

      sendToBack: (id: string) => {
        set((state) => {
          const index = state.elements.findIndex((el) => el.id === id);
          if (index <= 0) return state;
          const elements = [...state.elements];
          const [moved] = elements.splice(index, 1);
          elements.unshift(moved);
          return { elements };
        });
      },

      groupElements: (ids: string[]) => {
        if (ids.length < 2) return;
        const groupId = `group-${Date.now()}`;
        const group: ElementGroup = {
          id: groupId,
          name: `Group ${get().groups.length + 1}`,
          elementIds: ids,
        };
        set((state) => ({
          groups: [...state.groups, group],
          elements: state.elements.map((el) =>
            ids.includes(el.id) ? { ...el, groupId } : el
          ),
        }));
      },

      ungroupElements: (groupId: string) => {
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== groupId),
          elements: state.elements.map((el) =>
            el.groupId === groupId ? { ...el, groupId: undefined } : el
          ),
        }));
      },

      setGuidelines: (guidelines: Guideline[]) => {
        set({ guidelines });
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        // Update document class for Tailwind dark mode
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setCanvasBackground: (color: string) => {
        set({ canvasBackground: color });
      },

      setZoom: (zoom: number) => {
        // Clamp zoom between 0.1 and 3
        set({ zoom: Math.max(0.1, Math.min(3, zoom)) });
      },

      setPan: (x: number, y: number) => {
        set({ panX: x, panY: y });
      },

      resetView: () => {
        set({ zoom: 1, panX: 0, panY: 0 });
      },
    }),
    {
      limit: 20, // 20 undo/redo steps
      partialize: (state) => {
        // Only track elements, groups, and canvas background for undo/redo
        const { elements, groups, canvasBackground } = state;
        return { elements, groups, canvasBackground };
      },
    }
  )
);

// Export temporal store for undo/redo access
export const useTemporalStore = () => useEditorStore.temporal;
