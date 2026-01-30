import { memo, useRef, useEffect, useState } from 'react';
import { Text } from 'react-konva';
import type { TextElement } from '@/store/types';
import type Konva from 'konva';

interface TextNodeProps {
    element: TextElement;
    isSelected: boolean;
    onSelect: (e?: Konva.KonvaEventObject<MouseEvent>) => void;
    onChange: (attrs: Partial<TextElement>) => void;
    onDoubleClick?: () => void;
}

export const TextNode = memo(function TextNode({
    element,
    isSelected: _isSelected,
    onSelect,
    onChange,
    onDoubleClick,
}: TextNodeProps) {
    const textRef = useRef<Konva.Text>(null);
    const [autoFitFontSize, setAutoFitFontSize] = useState(element.fontSize);

    // Build font style string
    const fontStyle = [
        element.fontWeight === 'bold' ? 'bold' : '',
        element.fontStyle === 'italic' ? 'italic' : '',
    ].filter(Boolean).join(' ') || 'normal';

    // Smart text fitting - auto-resize font to fit width
    useEffect(() => {
        const textNode = textRef.current;
        if (!textNode || !element.autoFit) {
            setAutoFitFontSize(element.fontSize);
            return;
        }

        // Calculate the optimal font size
        let fontSize = element.fontSize;
        const maxWidth = element.width;
        const maxHeight = element.height || 200; // Default max height

        // Reset to original size first
        textNode.fontSize(fontSize);

        // Shrink until it fits
        while (fontSize > 8 && (textNode.width() > maxWidth || textNode.height() > maxHeight)) {
            fontSize -= 1;
            textNode.fontSize(fontSize);
        }

        setAutoFitFontSize(fontSize);
    }, [element.text, element.width, element.height, element.fontSize, element.autoFit]);

    return (
        <Text
            ref={textRef}
            id={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            text={element.text}
            fontSize={element.autoFit ? autoFitFontSize : element.fontSize}
            fontFamily={element.fontFamily}
            fontStyle={fontStyle}
            textDecoration={element.textDecoration === 'underline' ? 'underline' : ''}
            fill={element.fill}
            align={element.align}
            rotation={element.rotation}
            scaleX={element.scaleX}
            scaleY={element.scaleY}
            opacity={element.opacity}
            visible={element.visible}
            draggable={!element.locked}
            onClick={(e) => onSelect(e)}
            onTap={() => onSelect()}
            onDblClick={onDoubleClick}
            onDblTap={onDoubleClick}
            onDragEnd={(e) => {
                onChange({
                    x: e.target.x(),
                    y: e.target.y(),
                });
            }}
            onTransformEnd={(e) => {
                const node = e.target as Konva.Text;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                onChange({
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(20, node.width() * scaleX),
                    fontSize: Math.max(8, element.fontSize * scaleY),
                    rotation: node.rotation(),
                    scaleX: 1,
                    scaleY: 1,
                });
            }}
        />
    );
});
