import type { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface EditorLayoutProps {
    toolbar: ReactNode;
    layerPanel: ReactNode;
    canvas: ReactNode;
    propertiesPanel: ReactNode;
}

export function EditorLayout({
    toolbar,
    layerPanel,
    canvas,
    propertiesPanel,
}: EditorLayoutProps) {
    return (
        <div className="flex h-screen w-screen flex-col bg-background text-foreground overflow-hidden">
            {/* Top Toolbar */}
            <header className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-sm font-semibold">Advanced Card Editor</h1>
                </div>
                <div className="flex-1 flex justify-center">{toolbar}</div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Layer Panel */}
                <aside className="w-60 border-r border-border bg-card flex flex-col overflow-hidden">
                    <div className="px-3 py-2 border-b border-border">
                        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Layers
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">{layerPanel}</div>
                </aside>

                {/* Center - Canvas */}
                <main className="flex-1 flex items-center justify-center bg-muted/30 overflow-auto p-8">
                    {canvas}
                </main>

                {/* Right Sidebar - Properties Panel */}
                <aside className="w-72 border-l border-border bg-card flex flex-col overflow-hidden">
                    <div className="px-3 py-2 border-b border-border">
                        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Properties
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">{propertiesPanel}</div>
                </aside>
            </div>
        </div>
    );
}
