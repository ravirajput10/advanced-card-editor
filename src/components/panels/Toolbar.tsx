import { useRef } from 'react';
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
    Undo2,
    Redo2,
    Trash2,
    Download,
    FileImage,
    FileText,
    Group,
    Ungroup,
    ZoomIn,
    ZoomOut,
    Maximize,
    Grid3X3,
    Upload,
    Save,
} from 'lucide-react';
import { IconPicker } from './IconPicker';
import { getStageRef } from '@/lib/stageRef';
import { jsPDF } from 'jspdf';
import { useDesignJSON } from '@/hooks/useDesignJSON';
import type { RectElement, CircleElement, TextElement, LineElement, ImageElement, IconElement } from '@/store/types';

// Generate unique ID
const generateId = () =>
    `element-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export function Toolbar() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const jsonInputRef = useRef<HTMLInputElement>(null);
    const addElement = useEditorStore((state) => state.addElement);
    const deleteElements = useEditorStore((state) => state.deleteElements);
    const selectedIds = useEditorStore((state) => state.selectedIds);
    const elements = useEditorStore((state) => state.elements);
    const groupElements = useEditorStore((state) => state.groupElements);
    const ungroupElements = useEditorStore((state) => state.ungroupElements);
    const zoom = useEditorStore((state) => state.zoom);
    const setZoom = useEditorStore((state) => state.setZoom);
    const resetView = useEditorStore((state) => state.resetView);

    // Grid settings
    const showGrid = useEditorStore((state) => state.showGrid);
    const setShowGrid = useEditorStore((state) => state.setShowGrid);
    const snapToGrid = useEditorStore((state) => state.snapToGrid);
    const setSnapToGrid = useEditorStore((state) => state.setSnapToGrid);

    // JSON hooks
    const { exportJSON, importJSON } = useDesignJSON();

    const { undo, redo, pastStates, futureStates } = useTemporalStore().getState();

    const canUndo = pastStates.length > 0;
    const canRedo = futureStates.length > 0;
    const canGroup = selectedIds.length >= 2;

    // Check if any selected element is in a group
    const selectedGroupId = selectedIds
        .map(id => elements.find(el => el.id === id)?.groupId)
        .find(groupId => groupId !== undefined);
    const canUngroup = !!selectedGroupId;

    const zoomPercent = Math.round(zoom * 100);

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

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;

            // Create a temp image to get dimensions
            const img = new window.Image();
            img.onload = () => {
                // Scale down if too large
                let width = img.width;
                let height = img.height;
                const maxSize = 200;

                if (width > maxSize || height > maxSize) {
                    const ratio = Math.min(maxSize / width, maxSize / height);
                    width = width * ratio;
                    height = height * ratio;
                }

                const element: ImageElement = {
                    id: generateId(),
                    type: 'image',
                    name: file.name.substring(0, 20),
                    x: 100,
                    y: 100,
                    width,
                    height,
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1,
                    visible: true,
                    locked: false,
                    src: dataUrl,
                };
                addElement(element);
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);

        // Reset file input
        e.target.value = '';
    };

    const handleIconSelect = (iconName: string) => {
        const element: IconElement = {
            id: generateId(),
            type: 'icon',
            name: iconName,
            x: 150,
            y: 150,
            width: 48,
            height: 48,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            visible: true,
            locked: false,
            iconName,
            fill: '#000000',
        };
        addElement(element);
    };

    const handleDelete = () => {
        if (selectedIds.length > 0) {
            deleteElements(selectedIds);
        }
    };

    const handleExport = (format: 'png' | 'jpeg' | 'pdf') => {
        const stage = getStageRef();
        if (!stage) {
            console.error('Stage not available');
            return;
        }

        const pixelRatio = 2;
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

        // Find UI elements to hide
        const transformer = stage.findOne('#selection-transformer');
        const grid = stage.findOne('#canvas-grid');
        const guidelines = stage.findOne('#snap-guidelines');

        // Store original visibility
        const transformerVisible = transformer?.visible();
        const gridVisible = grid?.visible();
        const guidelinesVisible = guidelines?.visible();

        // Hide UI elements
        transformer?.visible(false);
        grid?.visible(false);
        guidelines?.visible(false);

        // Export only the canvas area (600x350)
        // We use the layer for toDataURL if we want to avoid stage offsets/zoom
        const dataUrl = stage.toDataURL({
            mimeType,
            quality: format === 'jpeg' ? 0.92 : undefined,
            pixelRatio,
            // Clip to canvas bounds (0,0 to 600,350)
            x: 0,
            y: 0,
            width: 600,
            height: 350,
        });

        // Restore visibility
        if (transformerVisible !== undefined) transformer?.visible(transformerVisible);
        if (gridVisible !== undefined) grid?.visible(gridVisible);
        if (guidelinesVisible !== undefined) guidelines?.visible(guidelinesVisible);

        if (format === 'pdf') {
            const width = stage.width();
            const height = stage.height();
            const orientation = width > height ? 'landscape' : 'portrait';
            const pdf = new jsPDF({
                orientation,
                unit: 'px',
                format: [width, height],
            });
            pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
            pdf.save('card-design.pdf');
        } else {
            const link = document.createElement('a');
            link.download = `card-design.${format}`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await importJSON(file);
            // Reset file input
            e.target.value = '';
        } catch (error) {
            console.error('Import failed:', error);
            alert('Failed to import design: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    return (
        <TooltipProvider>
            <div className="flex items-center h-full gap-1 px-4 overflow-x-auto no-scrollbar">
                {/* Hidden file input for image upload */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />

                {/* Hidden file input for JSON import */}
                <input
                    ref={jsonInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportJSON}
                />

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

                {/* Add Image */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleImageClick}>
                            <Image className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Image</TooltipContent>
                </Tooltip>

                {/* Add Icon */}
                <IconPicker onSelect={handleIconSelect} />

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

                {/* Group */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => groupElements(selectedIds)}
                            disabled={!canGroup}
                        >
                            <Group className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Group Elements (Ctrl+G)</TooltipContent>
                </Tooltip>

                {/* Ungroup */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => selectedGroupId && ungroupElements(selectedGroupId)}
                            disabled={!canUngroup}
                        >
                            <Ungroup className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ungroup (Ctrl+Shift+G)</TooltipContent>
                </Tooltip>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Export */}
                <DropdownMenu>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Export</TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleExport('png')}>
                            <FileImage className="h-4 w-4 mr-2" />
                            Export as PNG
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('jpeg')}>
                            <FileImage className="h-4 w-4 mr-2" />
                            Export as JPEG
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('pdf')}>
                            <FileText className="h-4 w-4 mr-2" />
                            Export as PDF
                        </DropdownMenuItem>
                        <div className="h-px bg-border my-1" />
                        <DropdownMenuItem onClick={exportJSON}>
                            <Save className="h-4 w-4 mr-2" />
                            Download Design (JSON)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => jsonInputRef.current?.click()}>
                            <Upload className="h-4 w-4 mr-2" />
                            Import JSON
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Grid controls */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={showGrid ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setShowGrid(!showGrid)}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Show Grid</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={snapToGrid ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8 text-[10px] font-bold"
                            onClick={() => setSnapToGrid(!snapToGrid)}
                        >
                            SNAP
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Snap to Grid</TooltipContent>
                </Tooltip>

                <div className="w-px h-6 bg-border mx-2" />

                {/* Zoom Controls */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setZoom(zoom / 1.2)}
                            disabled={zoom <= 0.1}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom Out</TooltipContent>
                </Tooltip>

                <span className="text-xs text-muted-foreground min-w-[40px] text-center">
                    {zoomPercent}%
                </span>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setZoom(zoom * 1.2)}
                            disabled={zoom >= 3}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom In</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={resetView}
                        >
                            <Maximize className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset View (100%)</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
