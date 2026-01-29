import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Star,
    Heart,
    Circle,
    Square,
    Triangle,
    Hexagon,
    Phone,
    Mail,
    MapPin,
    Globe,
    User,
    Briefcase,
    Calendar,
    Clock,
    Camera,
    Bookmark,
    Award,
    Zap,
    Coffee,
    Music,
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    Github,
    Youtube,
    Send,
    MessageCircle,
    ThumbsUp,
    Check,
    X,
    Plus,
    Minus,
    ArrowRight,
    ArrowLeft,
    ChevronRight,
    ChevronDown,
    Home,
    Settings,
    Search,
    Sparkles,
    type LucideIcon,
} from 'lucide-react';

// Available icons for selection
const ICONS: { name: string; icon: LucideIcon }[] = [
    { name: 'star', icon: Star },
    { name: 'heart', icon: Heart },
    { name: 'circle', icon: Circle },
    { name: 'square', icon: Square },
    { name: 'triangle', icon: Triangle },
    { name: 'hexagon', icon: Hexagon },
    { name: 'phone', icon: Phone },
    { name: 'mail', icon: Mail },
    { name: 'map-pin', icon: MapPin },
    { name: 'globe', icon: Globe },
    { name: 'user', icon: User },
    { name: 'briefcase', icon: Briefcase },
    { name: 'calendar', icon: Calendar },
    { name: 'clock', icon: Clock },
    { name: 'camera', icon: Camera },
    { name: 'bookmark', icon: Bookmark },
    { name: 'award', icon: Award },
    { name: 'zap', icon: Zap },
    { name: 'coffee', icon: Coffee },
    { name: 'music', icon: Music },
    { name: 'linkedin', icon: Linkedin },
    { name: 'twitter', icon: Twitter },
    { name: 'facebook', icon: Facebook },
    { name: 'instagram', icon: Instagram },
    { name: 'github', icon: Github },
    { name: 'youtube', icon: Youtube },
    { name: 'send', icon: Send },
    { name: 'message-circle', icon: MessageCircle },
    { name: 'thumbs-up', icon: ThumbsUp },
    { name: 'check', icon: Check },
    { name: 'x', icon: X },
    { name: 'plus', icon: Plus },
    { name: 'minus', icon: Minus },
    { name: 'arrow-right', icon: ArrowRight },
    { name: 'arrow-left', icon: ArrowLeft },
    { name: 'chevron-right', icon: ChevronRight },
    { name: 'chevron-down', icon: ChevronDown },
    { name: 'home', icon: Home },
    { name: 'settings', icon: Settings },
    { name: 'search', icon: Search },
];

interface IconPickerProps {
    onSelect: (iconName: string) => void;
}

export function IconPicker({ onSelect }: IconPickerProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (iconName: string) => {
        onSelect(iconName);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Sparkles className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Add Icon</TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Choose an Icon</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="grid grid-cols-6 gap-2">
                        {ICONS.map(({ name, icon: Icon }) => (
                            <Button
                                key={name}
                                variant="outline"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => handleSelect(name)}
                                title={name}
                            >
                                <Icon className="h-5 w-5" />
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

// Export the icon list for rendering
export { ICONS };
