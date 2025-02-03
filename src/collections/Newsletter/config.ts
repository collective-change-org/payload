import type { CollectionConfig } from 'payload'

export const Newsletter: CollectionConfig<'newsletter'> = {
  slug: 'newsletter',
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Event Updates', value: 'event' },
      ],
    },
  ],
}
