import { memo, useEffect, useState } from 'react';
import { Image as KonvaImage } from 'react-konva';
import type Konva from 'konva';
import type { ImageElement } from '@/store/types';

interface ImageNodeProps {
    element: ImageElement;
    isSelected: boolean;
    onSelect: (e?: Konva.KonvaEventObject<MouseEvent>) => void;
    onChange: (attrs: Partial<ImageElement>) => void;
}

export const ImageNode = memo(function ImageNode({
    element,
    isSelected: _isSelected,
    onSelect,
    onChange,
}: ImageNodeProps) {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            setImage(img);
        };
        img.src = element.src;
    }, [element.src]);

    if (!image) {
        return null;
    }

    return (
        <KonvaImage
            id={element.id}
            image={image}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            rotation={element.rotation}
            scaleX={element.scaleX}
            scaleY={element.scaleY}
            opacity={element.opacity}
            visible={element.visible}
            draggable={!element.locked}
            onClick={(e) => onSelect(e)}
            onTap={() => onSelect()}
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
                    width: Math.max(10, node.width() * node.scaleX()),
                    height: Math.max(10, node.height() * node.scaleY()),
                    rotation: node.rotation(),
                    scaleX: 1,
                    scaleY: 1,
                });
            }}
        />
    );
});
