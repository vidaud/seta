import { Stack } from '@mantine/core'
import { IconAt, IconBuilding } from '@tabler/icons-react'

import type { ContactIconProps, ContactIconVariant } from '~/types/contact'

import ContactIcon from '../ContactIcon/ContactIcon'

interface ContactIconsListProps {
  data?: ContactIconProps[]
  variant?: ContactIconVariant
}

const MOCKDATA = [
  { title: 'Office', description: 'JRC T4 Data Governance and Services', icon: IconBuilding },
  { title: 'Email', description: 'jrc-seta@ec.europa.eu', icon: IconAt }
]

const ContactIconsList = ({ data = MOCKDATA, variant }: ContactIconsListProps) => {
  // eslint-disable-next-line react/no-array-index-key
  const items = data.map((item, index) => <ContactIcon key={index} variant={variant} {...item} />)

  return <Stack>{items}</Stack>
}

export default ContactIconsList
