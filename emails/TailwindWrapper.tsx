import { Tailwind } from '@react-email/components'

export const TailwindWrapper = (props: { children: React.ReactNode }) => {
  return (
    <Tailwind
      config={{
        theme: {
          colors: {
            'off-white': '#FFFEFA',
            transparent: 'transparent',
            white: '#ffffff',
            black: '#000000',
            green: {
              black: '#001A15',
              dark: '#002922',
              lighter: '#338073',
            },
            orange: {
              dark: '#EB742F',
              light: '#FF8640',
            },
            yellow: {
              neon: '#F1FF86',
              300: '#E3FF0C',
            },
            pink: {
              light: '#FCCDFF',
            },
          },
          extend: {},
        },
      }}
    >
      {props.children}
    </Tailwind>
  )
}
