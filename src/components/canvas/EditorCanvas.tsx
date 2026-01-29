import { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import type { Stage as StageType } from 'konva/lib/Stage';
import type Konva from 'konva';
import { useEditorStore } from '@/store/useEditorStore';
import { RectNode, CircleNode, LineNode, TextNode, ImageNode } from '@/components/elements';
import type { CanvasElement, TextElement } from '@/store/types';

export function EditorCanvas() {
    const stageRef = useRef<StageType>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Text editing state
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [editingTextValue, setEditingTextValue] = useState('');
    const [textareaStyle, setTextareaStyle] = useState<React.CSSProperties>({});

    const canvasWidth = useEditorStore((state) => state.canvasWidth);
    const canvasHeight = useEditorStore((state) => state.canvasHeight);
    const canvasBackground = useEditorStore((state) => state.canvasBackground);
    const elements = useEditorStore((state) => state.elements);
    const selectedIds = useEditorStore((state) => state.selectedIds);
    const setSelection = useEditorStore((state) => state.setSelection);
    const addToSelection = useEditorStore((state) => state.addToSelection);
    const clearSelection = useEditorStore((state) => state.clearSelection);
    const updateElement = useEditorStore((state) => state.updateElement);

    // Update transformer when selection changes
    useEffect(() => {
        if (!transformerRef.current || !layerRef.current) return;

        const stage = stageRef.current;
        if (!stage) return;

        // Don't show transformer when editing text
        if (editingTextId) {
            transformerRef.current.nodes([]);
            return;
        }

        // Find selected nodes
        const selectedNodes = selectedIds
            .map((id) => stage.findOne(`#${id}`))
            .filter((node): node is Konva.Node => node !== undefined);

        transformerRef.current.nodes(selectedNodes);
        layerRef.current.batchDraw();
    }, [selectedIds, elements, editingTextId]);

    // Handle click on stage (deselect)
    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        // If editing text, finish editing first
        if (editingTextId) {
            finishTextEditing();
            return;
        }

        // If clicked on empty area (stage or background rect), clear selection
        const clickedOnEmpty =
            e.target === e.target.getStage() ||
            e.target.attrs.id === 'canvas-background';
        if (clickedOnEmpty) {
            clearSelection();
        }
    };

    // Handle element selection
    const handleSelect = useCallback(
        (id: string, e?: Konva.KonvaEventObject<MouseEvent>) => {
            if (editingTextId) {
                finishTextEditing();
                return;
            }
            const isCtrlPressed = e?.evt?.ctrlKey || e?.evt?.metaKey;
            if (isCtrlPressed) {
                addToSelection(id);
            } else {
                setSelection([id]);
            }
        },
        [setSelection, addToSelection, editingTextId]
    );

    // Handle element change
    const handleChange = useCallback(
        (id: string, attrs: Partial<CanvasElement>) => {
            updateElement(id, attrs);
        },
        [updateElement]
    );

    // Start text editing
    const startTextEditing = useCallback((element: TextElement) => {
        if (!stageRef.current || !containerRef.current) return;

        const textNode = stageRef.current.findOne(`#${element.id}`);
        if (!textNode) return;

        // Hide the text node temporarily
        textNode.hide();
        layerRef.current?.batchDraw();

        // Get absolute position
        const absPos = textNode.absolutePosition();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate textarea style
        const style: React.CSSProperties = {
            position: 'absolute',
            top: absPos.y,
            left: absPos.x,
            width: element.width,
            minHeight: element.fontSize * 1.5,
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
            fontWeight: element.fontWeight,
            fontStyle: element.fontStyle,
            textAlign: element.align,
            color: element.fill,
            border: '1px solid #3b82f6',
            padding: '2px 4px',
            margin: 0,
            overflow: 'hidden',
            background: 'transparent',
            outline: 'none',
            resize: 'none',
            lineHeight: 1.2,
            transformOrigin: 'left top',
            transform: `rotate(${element.rotation}deg)`,
            zIndex: 1000,
        };

        setTextareaStyle(style);
        setEditingTextValue(element.text);
        setEditingTextId(element.id);
    }, []);

    // Finish text editing
    const finishTextEditing = useCallback(() => {
        if (!editingTextId) return;

        // Update element with new text
        if (editingTextValue.trim() !== '') {
            updateElement(editingTextId, { text: editingTextValue });
        }

        // Show the text node again
        if (stageRef.current) {
            const textNode = stageRef.current.findOne(`#${editingTextId}`);
            if (textNode) {
                textNode.show();
                layerRef.current?.batchDraw();
            }
        }

        setEditingTextId(null);
        setEditingTextValue('');
    }, [editingTextId, editingTextValue, updateElement]);

    // Handle textarea keydown
    const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            // Cancel editing
            if (stageRef.current && editingTextId) {
                const textNode = stageRef.current.findOne(`#${editingTextId}`);
                if (textNode) {
                    textNode.show();
                    layerRef.current?.batchDraw();
                }
            }
            setEditingTextId(null);
            setEditingTextValue('');
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            finishTextEditing();
        }
    };

    // Render element based on type
    const renderElement = (element: CanvasElement) => {
        const isSelected = selectedIds.includes(element.id);

        switch (element.type) {
            case 'rect':
                return (
                    <RectNode
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(element.id)}
                        onChange={(attrs) => handleChange(element.id, attrs)}
                    />
                );
            case 'circle':
                return (
                    <CircleNode
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(element.id)}
                        onChange={(attrs) => handleChange(element.id, attrs)}
                    />
                );
            case 'line':
                return (
                    <LineNode
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(element.id)}
                        onChange={(attrs) => handleChange(element.id, attrs)}
                    />
                );
            case 'text':
                return (
                    <TextNode
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(element.id)}
                        onChange={(attrs) => handleChange(element.id, attrs)}
                        onDoubleClick={() => startTextEditing(element)}
                    />
                );
            case 'image':
                return (
                    <ImageNode
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(element.id)}
                        onChange={(attrs) => handleChange(element.id, attrs)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={containerRef}
            className="shadow-lg rounded-sm overflow-hidden relative"
            style={{
                width: canvasWidth,
                height: canvasHeight,
            }}
        >
            <Stage
                ref={stageRef}
                width={canvasWidth}
                height={canvasHeight}
                onClick={handleStageClick}
                onTap={handleStageClick}
            >
                <Layer ref={layerRef}>
                    {/* Canvas background */}
                    <Rect
                        id="canvas-background"
                        x={0}
                        y={0}
                        width={canvasWidth}
                        height={canvasHeight}
                        fill={canvasBackground}
                    />

                    {/* Render all elements */}
                    {elements.map(renderElement)}

                    {/* Transformer for selection */}
                    <Transformer
                        ref={transformerRef}
                        rotateEnabled={true}
                        enabledAnchors={[
                            'top-left',
                            'top-center',
                            'top-right',
                            'middle-left',
                            'middle-right',
                            'bottom-left',
                            'bottom-center',
                            'bottom-right',
                        ]}
                        boundBoxFunc={(oldBox, newBox) => {
                            // Minimum size constraint
                            if (newBox.width < 5 || newBox.height < 5) {
                                return oldBox;
                            }
                            return newBox;
                        }}
                    />
                </Layer>
            </Stage>

            {/* Text editing overlay */}
            {editingTextId && (
                <textarea
                    autoFocus
                    style={textareaStyle}
                    value={editingTextValue}
                    onChange={(e) => setEditingTextValue(e.target.value)}
                    onKeyDown={handleTextareaKeyDown}
                    onBlur={finishTextEditing}
                />
            )}
        </div>
    );
}
