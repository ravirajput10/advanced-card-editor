import { memo, useEffect, useState, useRef } from 'react';
import { Image as KonvaImage } from 'react-konva';
import type { IconElement } from '@/store/types';

interface IconNodeProps {
    element: IconElement;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (attrs: Partial<IconElement>) => void;
}

// Convert Lucide icon to SVG data URL
function createIconDataUrl(iconName: string, fill: string, size: number): string {
    // Import dynamically from lucide-react
    const iconSvg = getIconSvg(iconName, fill, size);
    return `data:image/svg+xml;base64,${btoa(iconSvg)}`;
}

// Get SVG string for icon
function getIconSvg(iconName: string, fill: string, size: number): string {
    // Map of icon paths (simplified paths from Lucide)
    const iconPaths: Record<string, string> = {
        'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
        'phone': 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
        'mail': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
        'map-pin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
        'globe': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
        'user': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
        'briefcase': 'M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
        'linkedin': 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
        'twitter': 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
        'facebook': 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
        'instagram': 'M17.5 2h-11A4.5 4.5 0 0 0 2 6.5v11A4.5 4.5 0 0 0 6.5 22h11a4.5 4.5 0 0 0 4.5-4.5v-11A4.5 4.5 0 0 0 17.5 2z M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01',
        'github': 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
        'check': 'M20 6L9 17l-5-5',
        'x': 'M18 6L6 18 M6 6l12 12',
        'plus': 'M12 5v14 M5 12h14',
        'minus': 'M5 12h14',
        'arrow-right': 'M5 12h14 M12 5l7 7-7 7',
        'arrow-left': 'M19 12H5 M12 19l-7-7 7-7',
        'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
        'settings': 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
        'search': 'M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l4.5 4.5',
    };

    const path = iconPaths[iconName] || iconPaths['star'];

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path.split(' M').map((p, i) => `<path d="${i === 0 ? p : 'M' + p}"/>`).join('')}</svg>`;
}

export const IconNode = memo(function IconNode({
    element,
    isSelected: _isSelected,
    onSelect,
    onChange,
}: IconNodeProps) {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const lastPropsRef = useRef({ iconName: '', fill: '', width: 0, height: 0 });

    useEffect(() => {
        // Only reload if relevant props changed
        const propsChanged =
            lastPropsRef.current.iconName !== element.iconName ||
            lastPropsRef.current.fill !== element.fill ||
            lastPropsRef.current.width !== element.width ||
            lastPropsRef.current.height !== element.height;

        if (!propsChanged && image) return;

        lastPropsRef.current = {
            iconName: element.iconName,
            fill: element.fill,
            width: element.width,
            height: element.height,
        };

        const size = Math.max(element.width, element.height);
        const dataUrl = createIconDataUrl(element.iconName, element.fill, size);

        const img = new window.Image();
        img.onload = () => {
            setImage(img);
        };
        img.src = dataUrl;
    }, [element.iconName, element.fill, element.width, element.height, image]);

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
