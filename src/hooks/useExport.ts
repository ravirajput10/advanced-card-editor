import { useCallback } from 'react';
import type { Stage } from 'konva/lib/Stage';
import { jsPDF } from 'jspdf';

type ExportFormat = 'png' | 'jpeg' | 'pdf';

interface ExportOptions {
    format: ExportFormat;
    quality?: number; // 0-1 for JPEG
    pixelRatio?: number; // For higher resolution exports
    filename?: string;
}

export function useExport(stageRef: React.RefObject<Stage | null>) {
    const exportCanvas = useCallback(
        (options: ExportOptions) => {
            const stage = stageRef.current;
            if (!stage) {
                console.error('Stage not available');
                return;
            }

            const {
                format,
                quality = 0.92,
                pixelRatio = 2,
                filename = 'card-design',
            } = options;

            // Get data URL from stage
            const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
            const dataUrl = stage.toDataURL({
                mimeType,
                quality: format === 'jpeg' ? quality : undefined,
                pixelRatio,
            });

            if (format === 'pdf') {
                // Create PDF with jsPDF
                const width = stage.width();
                const height = stage.height();

                // Create PDF in landscape/portrait based on dimensions
                const orientation = width > height ? 'landscape' : 'portrait';
                const pdf = new jsPDF({
                    orientation,
                    unit: 'px',
                    format: [width, height],
                });

                // Add the image to PDF
                pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
                pdf.save(`${filename}.pdf`);
            } else {
                // Download as image
                const link = document.createElement('a');
                link.download = `${filename}.${format}`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        },
        [stageRef]
    );

    const exportPNG = useCallback(
        (pixelRatio = 2) => {
            exportCanvas({ format: 'png', pixelRatio });
        },
        [exportCanvas]
    );

    const exportJPEG = useCallback(
        (quality = 0.92, pixelRatio = 2) => {
            exportCanvas({ format: 'jpeg', quality, pixelRatio });
        },
        [exportCanvas]
    );

    const exportPDF = useCallback(
        (pixelRatio = 2) => {
            exportCanvas({ format: 'pdf', pixelRatio });
        },
        [exportCanvas]
    );

    return {
        exportCanvas,
        exportPNG,
        exportJPEG,
        exportPDF,
    };
}
