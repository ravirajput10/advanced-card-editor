import { useEditorStore, useTemporalStore } from '@/store/useEditorStore';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Type,
    Square,
    Circle,
    Minus,
    Image,
    Sparkles,
    Undo2,
    Redo2,
    Trash2,
} from 'lucide-react';
import type { RectElement, CircleElement, TextElement, LineElement } from '@/store/types';

// Generate unique ID
const generateId = () =>
    `element-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export function Toolbar() {
    const addElement = useEditorStore((state) => state.addElement);
    const deleteElements = useEditorStore((state) => state.deleteElements);
    const selectedIds = useEditorStore((state) => state.selectedIds);
    const { undo, redo, pastStates, futureStates } = useTemporalStore().getState();

    const canUndo = pastStates.length > 0;
    const canRedo = futureStates.length > 0;

    const addText = () => {
        const element: TextElement = {
            id: generateId(),
            type: 'text',
            name: 'Text',
            x: 100,
            y: 100,
            width: 200,
            height: 40,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            visible: true,
            locked: false,
            text: 'Double-click to edit',
            fontSize: 24,
            fontFamily: 'Arial',
            fontStyle: 'normal',
            fontWeight: 'normal',
            textDecoration: 'none',
            fill: '#000000',
            align: 'left',
        };
        addElement(element);
    };

    const addRect = () => {
        const element: RectElement = {
            id: generateId(),
            type: 'rect',
            name: 'Rectangle',
            x: 100,
            y: 100,
            width: 150,
            height: 100,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#3b82f6',
            stroke: '#1d4ed8',
            strokeWidth: 0,
            cornerRadius: 0,
        };
        addElement(element);
    };

    const addCircle = () => {
        const element: CircleElement = {
            id: generateId(),
            type: 'circle',
            name: 'Circle',
            x: 150,
            y: 150,
            width: 100,
            height: 100,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            visible: true,
            locked: false,
            fill: '#22c55e',
            stroke: '#16a34a',
            strokeWidth: 0,
        };
        addElement(element);
    };

    const addLine = () => {
        const element: LineElement = {
            id: generateId(),
            type: 'line',
            name: 'Line',
            x: 100,
            y: 100,
            width: 200,
            height: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            visible: true,
            locked: false,
            points: [0, 0, 200, 0],
            stroke: '#000000',
            strokeWidth: 2,
        };
        addElement(element);
    };

    const handleDelete = () => {
        if (selectedIds.length > 0) {
            deleteElements(selectedIds);
        }
    };

    return (
        <TooltipProvider>
            <div className="flex items-center gap-1">
                {/* Add Text */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addText}>
                            <Type className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Text</TooltipContent>
                </Tooltip>

                {/* Add Shapes */}
                <DropdownMenu>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Square className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Add Shape</TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={addRect}>
                            <Square className="h-4 w-4 mr-2" />
                            Rectangle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={addCircle}>
                            <Circle className="h-4 w-4 mr-2" />
                            Circle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={addLine}>
                            <Minus className="h-4 w-4 mr-2" />
                            Line
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Add Image - TODO */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                            <Image className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Image (coming soon)</TooltipContent>
                </Tooltip>

                {/* Add Icon - TODO */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                            <Sparkles className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Icon (coming soon)</TooltipContent>
                </Tooltip>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Undo */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => undo()}
                            disabled={!canUndo}
                        >
                            <Undo2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                </Tooltip>

                {/* Redo */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => redo()}
                            disabled={!canRedo}
                        >
                            <Redo2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                </Tooltip>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Delete */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleDelete}
                            disabled={selectedIds.length === 0}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Selected</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
