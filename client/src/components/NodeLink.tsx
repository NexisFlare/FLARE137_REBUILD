import { Button } from '@/components/ui/button';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';

interface NodeLinkProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  description: string;
  language?: 'hu' | 'en';
}

export function NodeLink({
  eventId,
  eventTitle,
  eventDate,
  description,
  language = 'hu',
}: NodeLinkProps) {
  const [, navigate] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const handleNavigate = () => {
    // Navigate to interactive book and scroll to event
    navigate(`/interactive-book?event=${eventId}`);
    // Scroll to the event after navigation
    setTimeout(() => {
      const element = document.getElementById(`event-${eventId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-pulse');
      }
    }, 300);
  };

  return (
    <div
      className="inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handleNavigate}
        className="gap-2 group relative overflow-hidden"
      >
        <LinkIcon className="w-4 h-4 transition-transform group-hover:rotate-45" />
        <span className="text-xs font-mono">
          {language === 'hu' ? 'Idővonalon' : 'On Timeline'}
        </span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-foreground text-background rounded-lg shadow-lg whitespace-nowrap text-xs animate-fade-in">
          <p className="font-semibold">{eventTitle}</p>
          <p className="text-foreground/70">{eventDate}</p>
          <p className="text-foreground/60 mt-1 max-w-xs">{description}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
        </div>
      )}
    </div>
  );
}
