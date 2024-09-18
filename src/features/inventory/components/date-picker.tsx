import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

export default function DatePicker(props: {
  onChange: (d: Date) => void;
  date?: Date;
  label?: string;
  description?: string;
  disableFuture?: boolean;
}) {
  const disableFuture = props.disableFuture ?? true;
  return (
    <FormItem className="flex flex-col">
      <FormLabel>{props.label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !props.date && "text-muted-foreground"
              )}
            >
              {props.date ? (
                format(props.date, "PPP", { locale: es })
              ) : (
                <span>Elige una fecha</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={props.date}
            onSelect={(d) => d && props.onChange(d)}
            disabled={(date) =>
              (disableFuture && date > new Date()) ||
              date < new Date("1900-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormDescription>{props.description}</FormDescription>
      <FormMessage />
    </FormItem>
  );
}
