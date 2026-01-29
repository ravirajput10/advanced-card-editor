import { memo } from 'react';
import { Rect } from 'react-konva';
import type { RectElement } from '@/store/types';

interface RectNodeProps {
    element: RectElement;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (attrs: Partial<RectElement>) => void;
}

export const RectNode = memo(function RectNode({
    element,
    isSelected: _isSelected,
    onSelect,
    onChange,
}: RectNodeProps) {
    return (
        <Rect
            id={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            rotation={element.rotation}
            scaleX={element.scaleX}
            scaleY={element.scaleY}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            cornerRadius={element.cornerRadius}
            opacity={element.opacity}
            visible={element.visible}
            draggable={!element.locked}
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={(e) => {
                onChange({
                    x: e.target.x(),
                    y: e.target.y(),
                });
            }}
            onTransformEnd={(e) => {
                const node = e.target;
                onChange({
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(5, node.width() * node.scaleX()),
                    height: Math.max(5, node.height() * node.scaleY()),
                    rotation: node.rotation(),
                    scaleX: 1,
                    scaleY: 1,
                });
            }}
        />
    );
});
