import { Title, SimpleGrid, Image } from '@mantine/core'

import Breadcrumbs from '~/components/Breadcrumbs'

import image from '~/images/contact1.jpg'
import type { Crumb } from '~/types/breadcrumbs'

import ContactIconsList from './components/ContactIconsList/ContactIconsList'
import { useStyles } from './style'

const breadcrumbs: Crumb[] = [
  {
    title: 'Contact',
    path: '/contact'
  }
]

const ContactPage = () => {
  const { classes } = useStyles()

  return (
    <>
      {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} />}
      <div className={classes.wrapper}>
        <SimpleGrid cols={2} spacing="sm">
          <div style={{ alignItems: 'Center' }}>
            <Title className={classes.title}>Contact us</Title>
            <br />
            <ContactIconsList />
          </div>
          <div className={classes.form}>
            <Image src={image} maw={440} mx="auto" radius="xs" />
          </div>
        </SimpleGrid>
      </div>
    </>
  )
}

export default ContactPage
