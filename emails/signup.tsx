import * as React from 'react'
import {
  Html,
  Img,
  Section,
  Tailwind,
  Container,
  Font,
  Column,
  Row,
  Text,
  Heading,
  render,
} from '@react-email/components'
import { EmailButton } from './Button'
import { TailwindWrapper } from './TailwindWrapper'

export const renderSignup = (token: string) => render(<Email token={token} />)

export default function Email(props: { token: string }) {
  const url = `https://collective-change.de/login?token=${props.token}`

  return (
    <TailwindWrapper>
      <Html lang="de" className="bg-[#FFFBED]">
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-800-normal.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Uncut"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://github.com/kaspernordkvist/uncut_sans/raw/refs/heads/main/Webfonts/UncutSans-Regular.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Container className="bg-white p-[32px] max-w-[1024px] rounded-[12px]">
          <Section>
            <Img
              src="https://i.imgur.com/cpnC0tt.png"
              alt="Collective Change"
              className="mx-auto w-[256px]"
            />
          </Section>
          <Section>
            <Row>
              <Heading
                as="h1"
                className="text-2xl font-[Poppins] leading-snug uppercase text-green-dark"
              >
                Wilkommen in der Crew! Bestätige deine E-Mail!
              </Heading>
            </Row>
            <Row>
              <Text>
                Cool, dass du dich angemeldet hast! Du musst nur noch diese E-Mail bestätigen, dann
                geht&lsquo;s los!
              </Text>
            </Row>
            <Row>
              <Column className="border-orange-dark border-0 border-l-4 bg-orange-light/50 border-solid inline-block px-4 py-2 text-green-black">
                Wenn du dir einen Account erstellst, wirst du automatisch zur Newsletter-Liste
                hinzugefügt. Wenn du das nicht möchtest, bestätige bitte nicht deine E-Mail-Adresse.
              </Column>
            </Row>
            <Row className="mt-[16px]">
              <Column>
                <EmailButton href={url} color="green" size="small">
                  Account bestätigen
                </EmailButton>
              </Column>
            </Row>
          </Section>
        </Container>
      </Html>
    </TailwindWrapper>
  )
}
