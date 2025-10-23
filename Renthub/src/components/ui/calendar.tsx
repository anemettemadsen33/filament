import { ComponentProps } from "react"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4 justify-center",
        month: "space-y-3",
        caption: "flex justify-center items-center relative mb-1.5",
        caption_label: "text-base font-bold tracking-tight text-foreground",
        nav: "flex items-center gap-1 absolute right-0",
        nav_button: cn(
          "h-7 w-7 bg-background hover:bg-secondary border border-border hover:border-primary/40 rounded-lg p-0 transition-all duration-200 flex items-center justify-center group"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex w-full",
        weekday:
          "text-muted-foreground rounded-md font-semibold text-[10px] uppercase tracking-wide w-9 h-6 flex items-center justify-center",
        week: "flex w-full mt-1 gap-0.5",
        day_button: cn(
          "h-9 w-9 p-0 font-medium text-xs transition-all duration-200 rounded-lg relative",
          "hover:bg-secondary hover:scale-105 hover:shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent"
        ),
        day: "aria-selected:opacity-100",
        range_start:
          "day-range-start !bg-accent !text-white font-bold rounded-lg hover:!bg-accent/90 shadow-md shadow-accent/20 scale-105",
        range_end:
          "day-range-end !bg-accent !text-white font-bold rounded-lg hover:!bg-accent/90 shadow-md shadow-accent/20 scale-105",
        selected:
          "!bg-accent !text-white hover:!bg-accent/90 font-bold rounded-lg shadow-sm shadow-accent/15",
        today: "bg-primary/10 text-primary font-bold border border-primary/30 rounded-lg",
        outside:
          "day-outside text-muted-foreground/30 hover:text-muted-foreground/60",
        disabled: "text-muted-foreground/20 line-through hover:bg-transparent",
        range_middle:
          "aria-selected:bg-accent/15 aria-selected:text-foreground rounded-md hover:bg-accent/25",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          const Icon = orientation === "left" ? CaretLeft : CaretRight
          return (
            <Icon 
              className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" 
              weight="bold"
              {...props} 
            />
          )
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
