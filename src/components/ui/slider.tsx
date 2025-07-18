"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueChange, min = 0, max = 100, step = 1, className }, ref) => {
    const [isDragging, setIsDragging] = React.useState<number | null>(null);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    const getValueFromPosition = (clientX: number) => {
      if (!sliderRef.current) return min;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      const rawValue = min + percentage * (max - min);

      // Snap to step
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    };

    const handleMouseDown = (index: number, event: React.MouseEvent) => {
      event.preventDefault();
      setIsDragging(index);
    };

    const handleMouseMove = React.useCallback(
      (event: MouseEvent) => {
        if (isDragging === null) return;

        const newValue = getValueFromPosition(event.clientX);
        const newValues = [...value];

        if (isDragging === 0) {
          // First thumb - can't go beyond second thumb
          newValues[0] = Math.min(newValue, value[1] || max);
        } else {
          // Second thumb - can't go below first thumb
          newValues[1] = Math.max(newValue, value[0] || min);
        }

        onValueChange(newValues);
      },
      [isDragging, value, onValueChange, min, max]
    );

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(null);
    }, []);

    React.useEffect(() => {
      if (isDragging !== null) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

    const leftPercent = getPercentage(value[0] || min);
    const rightPercent = value[1] ? getPercentage(value[1]) : 100;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
      >
        <div
          ref={sliderRef}
          className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary cursor-pointer"
          onClick={(event) => {
            if (isDragging !== null) return;

            const newValue = getValueFromPosition(event.clientX);
            const newValues = [...value];

            // Determine which thumb to move based on proximity
            const leftDistance = Math.abs(newValue - (value[0] || min));
            const rightDistance = Math.abs(newValue - (value[1] || max));

            if (value.length === 1 || leftDistance <= rightDistance) {
              newValues[0] = newValue;
            } else {
              newValues[1] = newValue;
            }

            onValueChange(newValues);
          }}
        >
          {/* Range track */}
          <div
            className="absolute h-full bg-primary"
            style={{
              left: `${leftPercent}%`,
              width: `${rightPercent - leftPercent}%`,
            }}
          />
        </div>

        {/* Left thumb */}
        <div
          className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing absolute -translate-x-1/2 -translate-y-1/2 top-1/2"
          style={{ left: `${leftPercent}%` }}
          onMouseDown={(e) => handleMouseDown(0, e)}
        />

        {/* Right thumb (only if we have a second value) */}
        {value[1] !== undefined && (
          <div
            className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing absolute -translate-x-1/2 -translate-y-1/2 top-1/2"
            style={{ left: `${rightPercent}%` }}
            onMouseDown={(e) => handleMouseDown(1, e)}
          />
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
