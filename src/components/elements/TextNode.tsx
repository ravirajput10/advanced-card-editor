import { memo, useRef } from 'react';
import { Text } from 'react-konva';
import type { TextElement } from '@/store/types';
import type Konva from 'konva';

interface TextNodeProps {
    element: TextElement;
    isSelected: boolean;
    onSelect: () => void;
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

    // Build font style string
    const fontStyle = [
        element.fontWeight === 'bold' ? 'bold' : '',
        element.fontStyle === 'italic' ? 'italic' : '',
    ].filter(Boolean).join(' ') || 'normal';

    return (
        <Text
            ref={textRef}
            id={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            text={element.text}
            fontSize={element.fontSize}
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
            onClick={onSelect}
            onTap={onSelect}
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
