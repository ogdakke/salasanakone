import * as SliderPrimitive from "@radix-ui/react-slider"
import React from "react"

import "../../styles/ui/Slider.css"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ children, ...props }, ref) => (
  <SliderPrimitive.Root ref={ref} className="sliderRoot" {...props}>
    <SliderPrimitive.Track className="sliderTrack">
      <SliderPrimitive.Range className="sliderRange" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="sliderThumb" aria-label="Slider Thumb" asChild>
      {children}
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
