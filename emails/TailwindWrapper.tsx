import { Tailwind } from '@react-email/components'
import config from './tailwind.config'

export const TailwindWrapper = (props: { children: React.ReactNode }) => {
  return <Tailwind config={config}>{props.children}</Tailwind>
}
