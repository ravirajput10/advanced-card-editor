import { memo } from 'react';
import { Line } from 'react-konva';
import type { LineElement } from '@/store/types';

interface LineNodeProps {
    element: LineElement;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (attrs: Partial<LineElement>) => void;
}

export const LineNode = memo(function LineNode({
    element,
    isSelected: _isSelected,
    onSelect,
    onChange,
}: LineNodeProps) {
    return (
        <Line
            id={element.id}
            x={element.x}
            y={element.y}
            points={element.points}
            rotation={element.rotation}
            scaleX={element.scaleX}
            scaleY={element.scaleY}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            opacity={element.opacity}
            visible={element.visible}
            draggable={!element.locked}
            onClick={onSelect}
            onTap={onSelect}
            hitStrokeWidth={Math.max(10, element.strokeWidth)} // Easier to click
            onDragEnd={(e) => {
                onChange({
                    x: e.target.x(),
                    y: e.target.y(),
                });
            }}
            onTransformEnd={(e) => {
                const node = e.target;
                // Scale points instead of using scaleX/scaleY
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const scaledPoints = element.points.map((p, i) =>
                    i % 2 === 0 ? p * scaleX : p * scaleY
                );
                onChange({
                    x: node.x(),
                    y: node.y(),
                    points: scaledPoints,
                    rotation: node.rotation(),
                    scaleX: 1,
                    scaleY: 1,
                });
            }}
        />
    );
});
