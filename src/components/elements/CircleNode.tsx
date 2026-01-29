import { memo } from 'react';
import { Ellipse } from 'react-konva';
import type { CircleElement } from '@/store/types';

interface CircleNodeProps {
    element: CircleElement;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (attrs: Partial<CircleElement>) => void;
}

export const CircleNode = memo(function CircleNode({
    element,
    isSelected: _isSelected,
    onSelect,
    onChange,
}: CircleNodeProps) {
    // Use ellipse to support width/height independently
    const radiusX = element.width / 2;
    const radiusY = element.height / 2;

    return (
        <Ellipse
            id={element.id}
            x={element.x + radiusX} // Center position
            y={element.y + radiusY}
            radiusX={radiusX}
            radiusY={radiusY}
            rotation={element.rotation}
            scaleX={element.scaleX}
            scaleY={element.scaleY}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            opacity={element.opacity}
            visible={element.visible}
            draggable={!element.locked}
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={(e) => {
                // Convert center position back to top-left
                onChange({
                    x: e.target.x() - radiusX * e.target.scaleX(),
                    y: e.target.y() - radiusY * e.target.scaleY(),
                });
            }}
            onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const newRadiusX = radiusX * scaleX;
                const newRadiusY = radiusY * scaleY;
                onChange({
                    x: node.x() - newRadiusX,
                    y: node.y() - newRadiusY,
                    width: Math.max(10, newRadiusX * 2),
                    height: Math.max(10, newRadiusY * 2),
                    rotation: node.rotation(),
                    scaleX: 1,
                    scaleY: 1,
                });
            }}
        />
    );
});
