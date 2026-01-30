import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    label?: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
    const [localColor, setLocalColor] = useState(color);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync with external color changes
    useEffect(() => {
        setLocalColor(color);
    }, [color]);

    const handleChange = (newColor: string) => {
        setLocalColor(newColor);

        // Debounce the onChange to avoid too many updates
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            onChange(newColor);
        }, 50);
    };

    return (
        <div className="flex items-center gap-2">
            {label && (
                <span className="text-xs text-muted-foreground w-12">{label}</span>
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-8 h-8 p-0 border-2"
                        style={{ backgroundColor: localColor }}
                    />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                    <HexColorPicker color={localColor} onChange={handleChange} />
                    <div className="mt-2 flex items-center gap-2">
                        <input
                            type="text"
                            value={localColor}
                            onChange={(e) => handleChange(e.target.value)}
                            className="w-full px-2 py-1 text-xs border rounded bg-background"
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
