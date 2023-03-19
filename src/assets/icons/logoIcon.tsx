export const LogoIcon = ({...props}, size: {width: number, height: number}) => {
  const {width, height} = size;
  return (
  <svg width={width} height={height} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} >
  <circle cx="32" cy="32" r="32" fill="url(#paint0_linear_203_2)"/>
  <defs>
  <linearGradient id="paint0_linear_203_2" x1="41.3726" y1="-22.6274" x2="-3.88225" y2="22.6274" gradientUnits="userSpaceOnUse">
  <stop stopColor="#51FEFE"/>
  <stop offset="0.0625" stopColor="#5BD1FE"/>
  <stop offset="0.125" stopColor="#64ADFE"/>
  <stop offset="0.1875" stopColor="#6D8FFE"/>
  <stop offset="0.25" stopColor="#7576FF"/>
  <stop offset="0.3125" stopColor="#957CFF"/>
  <stop offset="0.375" stopColor="#B283FF"/>
  <stop offset="0.4375" stopColor="#C989FF"/>
  <stop offset="0.5" stopColor="#DD8EFF"/>
  <stop offset="0.5625" stopColor="#EC93FF"/>
  <stop offset="0.625" stopColor="#F997FF"/>
  <stop offset="0.6875" stopColor="#FF9BFB"/>
  <stop offset="0.75" stopColor="#FF9EF3"/>
  <stop offset="0.8125" stopColor="#FFA0EE"/>
  <stop offset="0.875" stopColor="#FFA2EA"/>
  <stop offset="0.9375" stopColor="#FFA3E8"/>
  <stop offset="1" stopColor="#FFA3E7"/>
  </linearGradient>
  </defs>
  </svg>

  )
}