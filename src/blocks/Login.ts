import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Badge, Code } from 'lucide-react'
import type { Block } from 'payload'
import { Aside } from './Aside/config'
import { MediaBlock } from './MediaBlock/config'

export const LoginBlock: Block = {
  slug: 'loginBlock',
  interfaceName: 'LoginBlock',

  fields: [
    // {
    //   name: 'media',
    //   type: 'upload',
    //   relationTo: 'media',
    //   required: true,
    // },
    {
      name: 'richText',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2'] }),
            BlocksFeature({ blocks: [MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
    },
  ],
}
