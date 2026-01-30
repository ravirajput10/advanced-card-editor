import { Line } from 'react-konva';
import type { SnapLine } from '@/hooks/useSnapping';

interface GuidelinesProps {
    lines: SnapLine[];
    canvasWidth: number;
    canvasHeight: number;
}

export function Guidelines({ lines, canvasWidth, canvasHeight }: GuidelinesProps) {
    if (lines.length === 0) return null;

    return (
        <>
            {lines.map((line, index) => {
                if (line.type === 'vertical') {
                    return (
                        <Line
                            key={`v-${index}`}
                            points={[line.position, 0, line.position, canvasHeight]}
                            stroke="#ff6b6b"
                            strokeWidth={1}
                            dash={[4, 4]}
                            listening={false}
                        />
                    );
                } else {
                    return (
                        <Line
                            key={`h-${index}`}
                            points={[0, line.position, canvasWidth, line.position]}
                            stroke="#ff6b6b"
                            strokeWidth={1}
                            dash={[4, 4]}
                            listening={false}
                        />
                    );
                }
            })}
        </>
    );
}
