import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      type: 'collapsible',
      label: 'Event Details',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'date',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'd.M.yyy',
                },
                width: '50%',
              },
              required: true,
            },
            {
              name: 'time',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'timeOnly',
                  displayFormat: 'HH:mm',
                  timeFormat: 'HH:mm',
                },
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'location',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'attendees',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
  ],
}
