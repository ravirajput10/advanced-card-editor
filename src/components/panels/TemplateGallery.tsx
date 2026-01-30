import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditorStore } from '@/store/useEditorStore';
import { cardTemplates, type CardTemplate } from '@/data/templates';
import { LayoutTemplate } from 'lucide-react';

export function TemplateGallery() {
    const [open, setOpen] = useState(false);
    const setCanvasBackground = useEditorStore((state) => state.setCanvasBackground);
    const addElement = useEditorStore((state) => state.addElement);
    const deleteElements = useEditorStore((state) => state.deleteElements);
    const elements = useEditorStore((state) => state.elements);
    const clearSelection = useEditorStore((state) => state.clearSelection);

    const applyTemplate = (template: CardTemplate) => {
        // Clear existing elements
        const allIds = elements.map((el) => el.id);
        if (allIds.length > 0) {
            deleteElements(allIds);
        }
        clearSelection();

        // Apply template
        setCanvasBackground(template.canvasBackground);

        // Add template elements with new IDs
        template.elements.forEach((element, index) => {
            setTimeout(() => {
                addElement({
                    ...element,
                    id: `element-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
                });
            }, index * 10);
        });

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <LayoutTemplate className="h-4 w-4" />
                    Templates
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Choose a Template</DialogTitle>
                    <DialogDescription>
                        Select a template to start your design. This will replace your current work.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] mt-4">
                    <div className="grid grid-cols-2 gap-4 pr-4">
                        {cardTemplates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => applyTemplate(template)}
                                className="group relative rounded-lg overflow-hidden border border-border hover:border-primary transition-colors text-left"
                            >
                                {/* Template Preview */}
                                <div
                                    className="h-32 w-full"
                                    style={{ background: template.thumbnail }}
                                />
                                {/* Template Info */}
                                <div className="p-3 bg-card">
                                    <h4 className="font-medium text-sm">{template.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {template.description}
                                    </p>
                                </div>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
                                        Use Template
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
