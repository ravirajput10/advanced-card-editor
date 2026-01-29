import { useEditorStore } from '@/store/useEditorStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ColorPicker } from './ColorPicker';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic,
    Underline,
    Lock,
    Unlock,
    Eye,
    EyeOff,
} from 'lucide-react';
import type { CanvasElement, TextElement, RectElement, CircleElement, LineElement, IconElement } from '@/store/types';

const FONTS = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Impact',
    'Comic Sans MS',
];

export function PropertiesPanel() {
    const elements = useEditorStore((state) => state.elements);
    const selectedIds = useEditorStore((state) => state.selectedIds);
    const updateElement = useEditorStore((state) => state.updateElement);

    // Get selected element(s)
    const selectedElements = elements.filter((el) => selectedIds.includes(el.id));

    if (selectedElements.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">Select an element to edit its properties</p>
            </div>
        );
    }

    if (selectedElements.length > 1) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">{selectedElements.length} elements selected</p>
                <p className="text-xs mt-1">Multi-element editing coming soon</p>
            </div>
        );
    }

    const element = selectedElements[0];

    const handleChange = (attrs: Partial<CanvasElement>) => {
        updateElement(element.id, attrs);
    };

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
                {/* Element Name */}
                <div>
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <Input
                        value={element.name}
                        onChange={(e) => handleChange({ name: e.target.value })}
                        className="mt-1 h-8 text-sm"
                    />
                </div>

                {/* Position */}
                <div>
                    <label className="text-xs font-medium text-muted-foreground">Position</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                            <span className="text-xs text-muted-foreground">X</span>
                            <Input
                                type="number"
                                value={Math.round(element.x)}
                                onChange={(e) => handleChange({ x: Number(e.target.value) })}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground">Y</span>
                            <Input
                                type="number"
                                value={Math.round(element.y)}
                                onChange={(e) => handleChange({ y: Number(e.target.value) })}
                                className="h-8 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Size */}
                <div>
                    <label className="text-xs font-medium text-muted-foreground">Size</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                            <span className="text-xs text-muted-foreground">W</span>
                            <Input
                                type="number"
                                value={Math.round(element.width)}
                                onChange={(e) => handleChange({ width: Number(e.target.value) })}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground">H</span>
                            <Input
                                type="number"
                                value={Math.round(element.height)}
                                onChange={(e) => handleChange({ height: Number(e.target.value) })}
                                className="h-8 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Rotation */}
                <div>
                    <label className="text-xs font-medium text-muted-foreground">Rotation</label>
                    <div className="flex items-center gap-2 mt-1">
                        <Slider
                            value={[element.rotation]}
                            onValueChange={([val]) => handleChange({ rotation: val })}
                            min={0}
                            max={360}
                            step={1}
                            className="flex-1"
                        />
                        <Input
                            type="number"
                            value={Math.round(element.rotation)}
                            onChange={(e) => handleChange({ rotation: Number(e.target.value) })}
                            className="w-16 h-8 text-sm"
                        />
                    </div>
                </div>

                {/* Opacity */}
                <div>
                    <label className="text-xs font-medium text-muted-foreground">Opacity</label>
                    <div className="flex items-center gap-2 mt-1">
                        <Slider
                            value={[element.opacity * 100]}
                            onValueChange={([val]) => handleChange({ opacity: val / 100 })}
                            min={0}
                            max={100}
                            step={1}
                            className="flex-1"
                        />
                        <span className="text-xs w-10 text-right">{Math.round(element.opacity * 100)}%</span>
                    </div>
                </div>

                {/* Visibility & Lock */}
                <div className="flex gap-2">
                    <Button
                        variant={element.visible ? 'outline' : 'secondary'}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleChange({ visible: !element.visible })}
                    >
                        {element.visible ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                        {element.visible ? 'Visible' : 'Hidden'}
                    </Button>
                    <Button
                        variant={element.locked ? 'secondary' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleChange({ locked: !element.locked })}
                    >
                        {element.locked ? <Lock className="h-4 w-4 mr-1" /> : <Unlock className="h-4 w-4 mr-1" />}
                        {element.locked ? 'Locked' : 'Unlocked'}
                    </Button>
                </div>

                <hr className="border-border" />

                {/* Type-specific properties */}
                {element.type === 'text' && <TextProperties element={element} onChange={handleChange} />}
                {element.type === 'rect' && <RectProperties element={element} onChange={handleChange} />}
                {element.type === 'circle' && <CircleProperties element={element} onChange={handleChange} />}
                {element.type === 'line' && <LineProperties element={element} onChange={handleChange} />}
                {element.type === 'icon' && <IconProperties element={element} onChange={handleChange} />}
            </div>
        </ScrollArea>
    );
}

// Text-specific properties
function TextProperties({
    element,
    onChange,
}: {
    element: TextElement;
    onChange: (attrs: Partial<TextElement>) => void;
}) {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-medium text-muted-foreground">Text</label>
                <textarea
                    value={element.text}
                    onChange={(e) => onChange({ text: e.target.value })}
                    className="mt-1 w-full h-20 px-3 py-2 text-sm border rounded-md bg-background resize-none"
                />
            </div>

            <div>
                <label className="text-xs font-medium text-muted-foreground">Font</label>
                <Select value={element.fontFamily} onValueChange={(val) => onChange({ fontFamily: val })}>
                    <SelectTrigger className="mt-1 h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {FONTS.map((font) => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="text-xs font-medium text-muted-foreground">Font Size</label>
                <Input
                    type="number"
                    value={element.fontSize}
                    onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                    className="mt-1 h-8 text-sm"
                    min={8}
                    max={200}
                />
            </div>

            <div>
                <label className="text-xs font-medium text-muted-foreground">Color</label>
                <div className="mt-1">
                    <ColorPicker color={element.fill} onChange={(color) => onChange({ fill: color })} />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-muted-foreground">Style</label>
                <div className="flex gap-1 mt-1">
                    <Button
                        variant={element.fontWeight === 'bold' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => onChange({ fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' })}
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={element.fontStyle === 'italic' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => onChange({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={element.textDecoration === 'underline' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => onChange({ textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' })}
                    >
                        <Underline className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-muted-foreground">Alignment</label>
                <div className="flex gap-1 mt-1">
                    <Button
                        variant={element.align === 'left' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => onChange({ align: 'left' })}
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={element.align === 'center' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => onChange({ align: 'center' })}
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={element.align === 'right' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => onChange({ align: 'right' })}
                    >
                        <AlignRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Rectangle properties
function RectProperties({
    element,
    onChange,
}: {
    element: RectElement;
    onChange: (attrs: Partial<RectElement>) => void;
}) {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-medium text-muted-foreground">Fill Color</label>
                <div className="mt-1">
                    <ColorPicker color={element.fill} onChange={(color) => onChange({ fill: color })} />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-muted-foreground">Stroke</label>
                <div className="flex items-center gap-2 mt-1">
                    <ColorPicker color={element.stroke} onChange={(color) => onChange({ stroke: color })} />
                    <Input
                        type="number"
                        value={element.strokeWidth}
                        onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })}
                        className="w-16 h-8 text-sm"
                        min={0}
                        max={20}
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-muted-foreground">Corner Radius</label>
                <div className="flex items-center gap-2 mt-1">
                    <Slider
                        value={[element.cornerRadius]}
                        onValueChange={([val]) => onChange({ cornerRadius: val })}
                        min={0}
                        max={50}
                        step={1}
                        className="flex-1"
                    />
                    <Input
                        type="number"
                        value={element.cornerRadius}
                        onChange={(e) => onChange({ cornerRadius: Number(e.target.value) })}
                        className="w-16 h-8 text-sm"
                    />
                </div>
            </div>
        </div>
    );
}

// Circle properties
function CircleProperties({
    element,
    onChange,
}: {
    element: CircleElement;
    onChange: (attrs: Partial<CircleElement>) => void;
}) {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-medium text-muted-foreground">Fill Color</label>
                <div className="mt-1">
                    <ColorPicker color={element.fill} onChange={(color) => onChange({ fill: color })} />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-muted-foreground">Stroke</label>
                <div className="flex items-center gap-2 mt-1">
                    <ColorPicker color={element.stroke} onChange={(color) => onChange({ stroke: color })} />
                    <Input
                        type="number"
                        value={element.strokeWidth}
                        onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })}
                        className="w-16 h-8 text-sm"
                        min={0}
                        max={20}
                    />
                </div>
            </div>
        </div>
    );
}

// Line properties
function LineProperties({
    element,
    onChange,
}: {
    element: LineElement;
    onChange: (attrs: Partial<LineElement>) => void;
}) {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-medium text-muted-foreground">Stroke Color</label>
                <div className="mt-1">
                    <ColorPicker color={element.stroke} onChange={(color) => onChange({ stroke: color })} />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-muted-foreground">Stroke Width</label>
                <div className="flex items-center gap-2 mt-1">
                    <Slider
                        value={[element.strokeWidth]}
                        onValueChange={([val]) => onChange({ strokeWidth: val })}
                        min={1}
                        max={20}
                        step={1}
                        className="flex-1"
                    />
                    <Input
                        type="number"
                        value={element.strokeWidth}
                        onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })}
                        className="w-16 h-8 text-sm"
                    />
                </div>
            </div>
        </div>
    );
}

// Icon properties
function IconProperties({
    element,
    onChange,
}: {
    element: IconElement;
    onChange: (attrs: Partial<IconElement>) => void;
}) {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-medium text-muted-foreground">Icon Color</label>
                <div className="mt-1">
                    <ColorPicker color={element.fill} onChange={(color) => onChange({ fill: color })} />
                </div>
            </div>
        </div>
    );
}
