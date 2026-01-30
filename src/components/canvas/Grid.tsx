import { memo, useMemo } from 'react';
import { Line, Group } from 'react-konva';

interface GridProps {
    width: number;
    height: number;
    gridSize: number;
    visible: boolean;
}

export const Grid = memo(function Grid({ width, height, gridSize, visible }: GridProps) {
    const lines = useMemo(() => {
        if (!visible) return [];

        const result: { points: number[]; key: string }[] = [];

        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            result.push({
                key: `v-${x}`,
                points: [x, 0, x, height],
            });
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            result.push({
                key: `h-${y}`,
                points: [0, y, width, y],
            });
        }

        return result;
    }, [width, height, gridSize, visible]);

    if (!visible) return null;

    return (
        <Group listening={false}>
            {lines.map((line) => (
                <Line
                    key={line.key}
                    points={line.points}
                    stroke="rgba(100, 100, 100, 0.2)"
                    strokeWidth={0.5}
                    listening={false}
                />
            ))}
        </Group>
    );
});
