import * as LabelPrimitive from '@radix-ui/react-label';
import React from 'react';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
  >(({className="", ...props}, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={`LabelRoot ${className}`}
      {...props}
      />
  ))
  Label.displayName = LabelPrimitive.Root.displayName
  export { Label }