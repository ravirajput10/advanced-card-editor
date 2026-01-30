import { useCallback } from 'react';
import { useEditorStore } from '@/store/useEditorStore';

export function useDesignJSON() {
    const elements = useEditorStore((state) => state.elements);
    const groups = useEditorStore((state) => state.groups);
    const canvasBackground = useEditorStore((state) => state.canvasBackground);
    const canvasWidth = useEditorStore((state) => state.canvasWidth);
    const canvasHeight = useEditorStore((state) => state.canvasHeight);

    // Export design as JSON
    const exportJSON = useCallback(() => {
        const design = {
            version: '1.0',
            canvas: {
                width: canvasWidth,
                height: canvasHeight,
                background: canvasBackground,
            },
            elements,
            groups,
            exportedAt: new Date().toISOString(),
        };

        const json = JSON.stringify(design, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `card-design-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [elements, groups, canvasBackground, canvasWidth, canvasHeight]);

    // Import design from JSON
    const importJSON = useCallback((file: File) => {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const json = e.target?.result as string;
                    const design = JSON.parse(json);
                    
                    // Validate basic structure
                    if (!design.elements || !Array.isArray(design.elements)) {
                        throw new Error('Invalid design file: missing elements array');
                    }
                    
                    // Get store actions
                    const state = useEditorStore.getState();
                    
                    // Clear existing elements
                    state.setSelection([]);
                    
                    // Set canvas background if available
                    if (design.canvas?.background) {
                        state.setCanvasBackground(design.canvas.background);
                    }
                    
                    // Clear existing elements by deleting all
                    const existingIds = state.elements.map(el => el.id);
                    state.deleteElements(existingIds);
                    
                    // Add imported elements
                    design.elements.forEach((element: unknown) => {
                        state.addElement(element as Parameters<typeof state.addElement>[0]);
                    });
                    
                    resolve();
                } catch (error) {
                    reject(error instanceof Error ? error : new Error('Failed to parse design file'));
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }, []);

    return {
        exportJSON,
        importJSON,
    };
}
