import {
  lexicalEditor,
  HeadingFeature,
  BlocksFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HorizontalRuleFeature,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { Aside } from './Aside/config'
import { Code } from './Code/config'
import { LinkCardBlock } from './LinkCard'
import { MediaBlock } from './MediaBlock/config'

export const HeroBlock: Block = {
  slug: 'heroBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1'] }),
            BlocksFeature({ blocks: [Aside, Code, MediaBlock, LinkCardBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: false,
      required: true,
    },
  ],
}
