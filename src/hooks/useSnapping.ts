import { useCallback } from 'react';
import type { CanvasElement } from '@/store/types';

const SNAP_THRESHOLD = 5; // pixels

export interface SnapLine {
    type: 'vertical' | 'horizontal';
    position: number;
    guide: 'start' | 'center' | 'end';
}

interface SnapResult {
    x: number;
    y: number;
    snapLines: SnapLine[];
}

export function useSnapping(
    elements: CanvasElement[],
    canvasWidth: number,
    canvasHeight: number
) {
    const getSnapPosition = useCallback(
        (
            draggedId: string,
            dragX: number,
            dragY: number,
            dragWidth: number,
            dragHeight: number,
            snapToGrid: boolean = false,
            gridSize: number = 20
        ): SnapResult => {
            const snapLines: SnapLine[] = [];
            let snappedX = dragX;
            let snappedY = dragY;

            // Apply grid snapping first if enabled
            if (snapToGrid) {
                snappedX = Math.round(dragX / gridSize) * gridSize;
                snappedY = Math.round(dragY / gridSize) * gridSize;
            }

            // Dragged element edges (after potential grid snap)
            const dragLeft = snappedX;
            const dragCenterX = snappedX + dragWidth / 2;
            const dragRight = snappedX + dragWidth;
            const dragTop = snappedY;
            const dragCenterY = snappedY + dragHeight / 2;
            const dragBottom = snappedY + dragHeight;

            // Canvas snap points
            const canvasSnapPointsX = [0, canvasWidth / 2, canvasWidth];
            const canvasSnapPointsY = [0, canvasHeight / 2, canvasHeight];

            // Check canvas snapping
            for (const point of canvasSnapPointsX) {
                // Left edge
                if (Math.abs(dragLeft - point) < SNAP_THRESHOLD) {
                    snappedX = point;
                    snapLines.push({ type: 'vertical', position: point, guide: 'start' });
                }
                // Center
                if (Math.abs(dragCenterX - point) < SNAP_THRESHOLD) {
                    snappedX = point - dragWidth / 2;
                    snapLines.push({ type: 'vertical', position: point, guide: 'center' });
                }
                // Right edge
                if (Math.abs(dragRight - point) < SNAP_THRESHOLD) {
                    snappedX = point - dragWidth;
                    snapLines.push({ type: 'vertical', position: point, guide: 'end' });
                }
            }

            for (const point of canvasSnapPointsY) {
                // Top edge
                if (Math.abs(dragTop - point) < SNAP_THRESHOLD) {
                    snappedY = point;
                    snapLines.push({ type: 'horizontal', position: point, guide: 'start' });
                }
                // Center
                if (Math.abs(dragCenterY - point) < SNAP_THRESHOLD) {
                    snappedY = point - dragHeight / 2;
                    snapLines.push({ type: 'horizontal', position: point, guide: 'center' });
                }
                // Bottom edge
                if (Math.abs(dragBottom - point) < SNAP_THRESHOLD) {
                    snappedY = point - dragHeight;
                    snapLines.push({ type: 'horizontal', position: point, guide: 'end' });
                }
            }

            // Check snapping to other elements
            for (const el of elements) {
                if (el.id === draggedId || !el.visible) continue;

                const elLeft = el.x;
                const elCenterX = el.x + el.width / 2;
                const elRight = el.x + el.width;
                const elTop = el.y;
                const elCenterY = el.y + el.height / 2;
                const elBottom = el.y + el.height;

                // Horizontal alignment (X snapping)
                // Left to Left
                if (Math.abs(dragLeft - elLeft) < SNAP_THRESHOLD) {
                    snappedX = elLeft;
                    snapLines.push({ type: 'vertical', position: elLeft, guide: 'start' });
                }
                // Left to Right
                if (Math.abs(dragLeft - elRight) < SNAP_THRESHOLD) {
                    snappedX = elRight;
                    snapLines.push({ type: 'vertical', position: elRight, guide: 'start' });
                }
                // Right to Left
                if (Math.abs(dragRight - elLeft) < SNAP_THRESHOLD) {
                    snappedX = elLeft - dragWidth;
                    snapLines.push({ type: 'vertical', position: elLeft, guide: 'end' });
                }
                // Right to Right
                if (Math.abs(dragRight - elRight) < SNAP_THRESHOLD) {
                    snappedX = elRight - dragWidth;
                    snapLines.push({ type: 'vertical', position: elRight, guide: 'end' });
                }
                // Center to Center
                if (Math.abs(dragCenterX - elCenterX) < SNAP_THRESHOLD) {
                    snappedX = elCenterX - dragWidth / 2;
                    snapLines.push({ type: 'vertical', position: elCenterX, guide: 'center' });
                }

                // Vertical alignment (Y snapping)
                // Top to Top
                if (Math.abs(dragTop - elTop) < SNAP_THRESHOLD) {
                    snappedY = elTop;
                    snapLines.push({ type: 'horizontal', position: elTop, guide: 'start' });
                }
                // Top to Bottom
                if (Math.abs(dragTop - elBottom) < SNAP_THRESHOLD) {
                    snappedY = elBottom;
                    snapLines.push({ type: 'horizontal', position: elBottom, guide: 'start' });
                }
                // Bottom to Top
                if (Math.abs(dragBottom - elTop) < SNAP_THRESHOLD) {
                    snappedY = elTop - dragHeight;
                    snapLines.push({ type: 'horizontal', position: elTop, guide: 'end' });
                }
                // Bottom to Bottom
                if (Math.abs(dragBottom - elBottom) < SNAP_THRESHOLD) {
                    snappedY = elBottom - dragHeight;
                    snapLines.push({ type: 'horizontal', position: elBottom, guide: 'end' });
                }
                // Center to Center
                if (Math.abs(dragCenterY - elCenterY) < SNAP_THRESHOLD) {
                    snappedY = elCenterY - dragHeight / 2;
                    snapLines.push({ type: 'horizontal', position: elCenterY, guide: 'center' });
                }
            }

            return { x: snappedX, y: snappedY, snapLines };
        },
        [elements, canvasWidth, canvasHeight]
    );

    return { getSnapPosition };
}
