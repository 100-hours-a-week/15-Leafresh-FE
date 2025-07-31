import { StaticImageData } from 'next/image'

export type SVGComponent = React.FC<React.SVGProps<SVGSVGElement>>
export type ImageSource = StaticImageData | string | SVGComponent
