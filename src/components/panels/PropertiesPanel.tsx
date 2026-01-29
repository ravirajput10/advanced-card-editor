import { useEditorStore } from '@/store/useEditorStore';

export function PropertiesPanel() {
    const selectedIds = useEditorStore((state) => state.selectedIds);
    const elements = useEditorStore((state) => state.elements);

    // Get selected elements
    const selectedElements = elements.filter((el) =>
        selectedIds.includes(el.id)
    );

    if (selectedElements.length === 0) {
        return (
            <div className="text-sm text-muted-foreground">
                Select an element to edit its properties
            </div>
        );
    }

    if (selectedElements.length > 1) {
        return (
            <div className="text-sm text-muted-foreground">
                {selectedElements.length} elements selected
            </div>
        );
    }

    const element = selectedElements[0];

    return (
        <div className="space-y-4">
            <div className="text-sm font-medium capitalize">{element.type}</div>

            {/* Position */}
            <div className="space-y-2">
                <div className="text-xs text-muted-foreground uppercase">Position</div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="text-xs">X: {Math.round(element.x)}</div>
                    <div className="text-xs">Y: {Math.round(element.y)}</div>
                </div>
            </div>

            {/* Size */}
            <div className="space-y-2">
                <div className="text-xs text-muted-foreground uppercase">Size</div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="text-xs">W: {Math.round(element.width)}</div>
                    <div className="text-xs">H: {Math.round(element.height)}</div>
                </div>
            </div>

            {/* Rotation */}
            <div className="space-y-2">
                <div className="text-xs text-muted-foreground uppercase">Rotation</div>
                <div className="text-xs">{Math.round(element.rotation)}°</div>
            </div>

            {/* TODO: Add type-specific controls */}
        </div>
    );
}
