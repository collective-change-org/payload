import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { ButtonBlock } from './Button'

export const SignupBlock: Block = {
  slug: 'signupBlock',
  interfaceName: 'signupBlock',

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
            BlocksFeature({ blocks: [ButtonBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
    },
  ],
}
