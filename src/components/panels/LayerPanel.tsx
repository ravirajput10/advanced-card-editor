import { useEditorStore } from '@/store/useEditorStore';

export function LayerPanel() {
    const elements = useEditorStore((state) => state.elements);
    const selectedIds = useEditorStore((state) => state.selectedIds);
    const setSelection = useEditorStore((state) => state.setSelection);

    if (elements.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                No elements yet
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Render in reverse order so top layer appears first */}
            {[...elements].reverse().map((element) => (
                <div
                    key={element.id}
                    onClick={() => setSelection([element.id])}
                    className={`
            flex items-center gap-2 px-3 py-2 cursor-pointer
            transition-colors duration-150 border-l-2
            hover:bg-accent/50
            ${selectedIds.includes(element.id)
                            ? 'bg-accent border-l-primary'
                            : 'border-l-transparent'
                        }
          `}
                >
                    <span className="text-xs text-muted-foreground w-6">
                        {element.type === 'text' && 'T'}
                        {element.type === 'rect' && '□'}
                        {element.type === 'circle' && '○'}
                        {element.type === 'line' && '—'}
                        {element.type === 'image' && '🖼'}
                        {element.type === 'icon' && '★'}
                    </span>
                    <span className="text-sm truncate flex-1">{element.name}</span>
                </div>
            ))}
        </div>
    );
}
