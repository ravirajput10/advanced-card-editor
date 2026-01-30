import { useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '@/store/useEditorStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
    Type,
    Square,
    Circle,
    Minus,
    Image,
    Sparkles,
    GripVertical,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Group,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { CanvasElement } from '@/store/types';

// Icon mapping for element types
const TYPE_ICONS: Record<CanvasElement['type'], typeof Type> = {
    text: Type,
    rect: Square,
    circle: Circle,
    line: Minus,
    image: Image,
    icon: Sparkles,
};

interface LayerItemProps {
    element: CanvasElement;
    isSelected: boolean;
    onSelect: () => void;
    onToggleVisibility: () => void;
    onToggleLock: () => void;
}

function LayerItem({
    element,
    isSelected,
    onSelect,
    onToggleVisibility,
    onToggleLock,
}: LayerItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: element.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const Icon = TYPE_ICONS[element.type];

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'layer-item flex items-center gap-1 px-2 py-1.5 rounded-md border cursor-pointer',
                isSelected
                    ? 'selected bg-primary/10 border-primary'
                    : 'bg-card border-transparent hover:bg-muted',
                isDragging && 'opacity-50',
                !element.visible && 'opacity-40'
            )}
            onClick={onSelect}
        >
            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            >
                <GripVertical className="h-4 w-4" />
            </div>

            {/* Type icon */}
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />

            {/* Name */}
            <span className="flex-1 text-sm truncate">{element.name}</span>

            {/* Group indicator */}
            {element.groupId && (
                <Badge variant="secondary" className="group-badge h-5 px-1.5 text-[10px] gap-0.5">
                    <Group className="h-3 w-3" />
                </Badge>
            )}

            {/* Actions */}
            <div className="flex items-center gap-0.5">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility();
                    }}
                >
                    {element.visible ? (
                        <Eye className="h-3 w-3" />
                    ) : (
                        <EyeOff className="h-3 w-3" />
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock();
                    }}
                >
                    {element.locked ? (
                        <Lock className="h-3 w-3" />
                    ) : (
                        <Unlock className="h-3 w-3" />
                    )}
                </Button>
            </div>
        </div>
    );
}

export function LayerPanel() {
    const elements = useEditorStore((state) => state.elements);
    const selectedIds = useEditorStore((state) => state.selectedIds);
    const setSelection = useEditorStore((state) => state.setSelection);
    const updateElement = useEditorStore((state) => state.updateElement);
    const reorderElement = useEditorStore((state) => state.reorderElement);

    // Sensors for drag detection
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require 5px movement before dragging
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Reverse elements for display (top = highest z-index)
    const displayElements = useMemo(() => [...elements].reverse(), [elements]);
    const elementIds = useMemo(() => displayElements.map((el) => el.id), [displayElements]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // Convert display indices back to actual indices
            const displayOldIndex = displayElements.findIndex((el) => el.id === active.id);
            const displayNewIndex = displayElements.findIndex((el) => el.id === over.id);

            // Calculate actual indices (reversed)
            const actualOldIndex = elements.length - 1 - displayOldIndex;
            const actualNewIndex = elements.length - 1 - displayNewIndex;

            reorderElement(actualOldIndex, actualNewIndex);
        }
    };

    if (elements.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">No layers yet</p>
                <p className="text-xs mt-1">Add elements from the toolbar</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full">
            <div className="p-2">
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                    LAYERS ({elements.length})
                </h3>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={elementIds} strategy={verticalListSortingStrategy}>
                        <div className="space-y-1">
                            {displayElements.map((element) => (
                                <LayerItem
                                    key={element.id}
                                    element={element}
                                    isSelected={selectedIds.includes(element.id)}
                                    onSelect={() => setSelection([element.id])}
                                    onToggleVisibility={() =>
                                        updateElement(element.id, { visible: !element.visible })
                                    }
                                    onToggleLock={() =>
                                        updateElement(element.id, { locked: !element.locked })
                                    }
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </ScrollArea>
    );
}
