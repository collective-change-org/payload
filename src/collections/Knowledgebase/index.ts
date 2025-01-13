import type { CollectionConfig, Payload } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Aside } from '../../blocks/Aside/config'
import { Code } from '../../blocks/Code/config'
import { Badge } from '../../blocks/Badge/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'
import { Group } from '@/payload-types'

async function getGroupSlug(groupId: number, payload: Payload) {
  const group = await payload.findByID({
    collection: 'groups',
    id: groupId,
  })
  const groupSlug = group.slug
  const parent = group.parent as Group | null
  if (parent) {
    return `${await getGroupSlug(parent.id, payload)}/${groupSlug}`
  }
  return groupSlug
}

export const Knowledgebase: CollectionConfig<'knowledgebase'> = {
  slug: 'knowledgebase',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    slugWithGroup: true,
    // group: false,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'knowledgebase',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'knowledgebase',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'docOrder',
      label: 'Document Order',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          // async ({ value, ...rest }) => {
          //   // if the value is empty, return highest value
          //   if (value === '' || value === null || value === undefined) {
          //     const highestDoc = await rest.req.payload.find({
          //       collection: 'knowledgebase',
          //       limit: 1,
          //       sort: '-docOrder',
          //     })
          //     if (highestDoc.totalDocs > 0) {
          //       return (highestDoc.docs[0].docOrder ?? 0) + 1
          //     }
          //     return 0
          //   }
          //   // Check if the value is already in use
          //   // If it is, increment all other documents by 1
          //   const existingDocs = await rest.req.payload.find({
          //     collection: 'knowledgebase',
          //     where: {
          //       docOrder: {
          //         equals: value,
          //       },
          //     },
          //   })
          //   if (existingDocs.totalDocs > 0) {
          //     await Promise.all(
          //       existingDocs.docs.map(async (doc) => {
          //         if (!doc.docOrder) {
          //           return
          //         }
          //         await rest.req.payload.update({
          //           collection: 'knowledgebase',
          //           id: doc.id,
          //           data: {
          //             docOrder: doc.docOrder! + 1,
          //           },
          //         })
          //       }),
          //     )
          //   }
          //   return value
          // },
        ],
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'group',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: false,
              relationTo: 'groups',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Aside, Badge, Code, MediaBlock] }),
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
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'badgeText',
      label: 'Badge Text',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'badgeVariant',
      label: 'Badge Variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Note', value: 'note' },
        { label: 'Danger', value: 'danger' },
        { label: 'Success', value: 'success' },
        { label: 'Caution', value: 'caution' },
        { label: 'Tip', value: 'tip' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    ...slugField(),
    {
      name: 'slugWithGroup',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (data && data.group) {
              const slug = await getGroupSlug(data.group as number, req.payload)
              return `${slug}/${data.slug}`
            }
            return data?.slug ?? ''
          },
        ],
      },
    },
    {
      name: 'restricted',
      type: 'select',
      options: [
        {
          label: 'Public',
          value: 'public',
        },
        {
          label: 'Members Only',
          value: 'members',
        },
      ],
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'public',
    },
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
