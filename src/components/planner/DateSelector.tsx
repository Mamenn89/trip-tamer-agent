
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateSelectorProps {
  label: string;
  date: Date | null;
  onSelect: (date: Date | null) => void;
  disabled?: (date: Date) => boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  label, 
  date, 
  onSelect, 
  disabled = () => false 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white hover:bg-gray-50",
              !date && "text-gray-500"
            )}
          >
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            {date ? (
              format(date, "PPP")
            ) : (
              <span>Select {label.toLowerCase()}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <CalendarComponent
            mode="single"
            selected={date || undefined}
            onSelect={onSelect}
            disabled={disabled}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
