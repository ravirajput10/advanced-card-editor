import { useEditorStore } from '@/store/useEditorStore';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export function ThemeToggle() {
    const theme = useEditorStore((state) => state.theme);
    const setTheme = useEditorStore((state) => state.setTheme);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-8 w-8"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
