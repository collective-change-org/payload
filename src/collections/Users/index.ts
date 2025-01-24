import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { render } from '@react-email/components'
import Email, { renderSignup } from '../../../emails/signup'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: {
    verify: {
      generateEmailHTML: async ({ req, token, user }) => {
        // Use the token provided to allow your user to verify their account
        const url = `https://collective-change.de/login?token=${token}`

        const emailHtml = await renderSignup(token)

        return emailHtml
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Team', value: 'team' },
        { label: 'Crew', value: 'crew' },
      ],
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  timestamps: true,
}
