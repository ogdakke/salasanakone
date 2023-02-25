import * as Slider from '@radix-ui/react-slider';

export default function SliderComponent (props: any) {
  return (
  <Slider.Root className="sliderRoot"
    onValueChange={(val: number[]) => {console.log(val);
    }}
    defaultValue={props.defaultValue} 
    max={props.maxValue} min={props.minValue}
    aria-label={props.Arialabel}>
    <Slider.Track className="sliderTrack">
      <Slider.Range className="sliderRange"/>
    </Slider.Track>
    <Slider.Thumb className="sliderThumb"/>
  </Slider.Root>
);}