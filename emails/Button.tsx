import { Button, Container, Text } from '@react-email/components'
import { TailwindWrapper } from './TailwindWrapper'

export const EmailButton = (props: {
  href: string
  children: React.ReactNode
  color: 'green' | 'orange' | 'black'
  size: 'small' | 'large'
}) => {
  const color =
    props.color === 'green'
      ? 'bg-green-lighter hover:bg-green-dark text-white'
      : props.color === 'orange'
        ? 'bg-orange-light hover:bg-orange-dark text-black'
        : 'bg-green-black hover:bg-black text-white'

  const size =
    props.size === 'small' ? 'text-base px-[20px] py-[10px]' : 'text-2xl h-[56px] px-[24px]'

  return (
    <Button
      href={props.href}
      className={`rounded-full border-white/10 border-2 uppercase
            inline-block cursor-pointer no-underline min-w-fit ${color} ${size}`}
    >
      <Text className="m-auto">{props.children}</Text>
    </Button>
  )
}
