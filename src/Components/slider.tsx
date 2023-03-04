import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import "../styles/Slider.css"


const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className="sliderRoot"
    {...props}
  >
    <SliderPrimitive.Track className="sliderTrack">
      <SliderPrimitive.Range className="sliderRange" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="sliderThumb" aria-label='Slider Thumb' />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName
 
export { Slider }