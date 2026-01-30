import { useEffect } from 'react';
import { useEditorStore, useTemporalStore } from '@/store/useEditorStore';

export function useKeyboard() {
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const elements = useEditorStore((state) => state.elements);
  const deleteElements = useEditorStore((state) => state.deleteElements);
  const updateElement = useEditorStore((state) => state.updateElement);
  const setSelection = useEditorStore((state) => state.setSelection);
  const groupElements = useEditorStore((state) => state.groupElements);
  const ungroupElements = useEditorStore((state) => state.ungroupElements);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const { undo, redo } = useTemporalStore().getState();
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const step = e.shiftKey ? 10 : 1;

      // Undo: Ctrl+Z
      if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (isCtrlOrCmd && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }

      // Select All: Ctrl+A
      if (isCtrlOrCmd && e.key === 'a') {
        e.preventDefault();
        setSelection(elements.map((el) => el.id));
        return;
      }

      // Group: Ctrl+G
      if (isCtrlOrCmd && e.key === 'g' && !e.shiftKey) {
        e.preventDefault();
        if (selectedIds.length >= 2) {
          groupElements(selectedIds);
        }
        return;
      }

      // Ungroup: Ctrl+Shift+G
      if (isCtrlOrCmd && e.key === 'G' && e.shiftKey) {
        e.preventDefault();
        // Find groupId from any selected element
        for (const id of selectedIds) {
          const element = elements.find((el) => el.id === id);
          if (element?.groupId) {
            ungroupElements(element.groupId);
            break;
          }
        }
        return;
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0) {
        e.preventDefault();
        deleteElements(selectedIds);
        return;
      }

      // Arrow keys: move selected elements
      if (selectedIds.length > 0) {
        let dx = 0;
        let dy = 0;

        switch (e.key) {
          case 'ArrowUp':
            dy = -step;
            break;
          case 'ArrowDown':
            dy = step;
            break;
          case 'ArrowLeft':
            dx = -step;
            break;
          case 'ArrowRight':
            dx = step;
            break;
          default:
            return;
        }

        if (dx !== 0 || dy !== 0) {
          e.preventDefault();
          selectedIds.forEach((id) => {
            const element = elements.find((el) => el.id === id);
            if (element && !element.locked) {
              updateElement(id, {
                x: element.x + dx,
                y: element.y + dy,
              });
            }
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, elements, deleteElements, updateElement, setSelection, groupElements, ungroupElements]);
}

