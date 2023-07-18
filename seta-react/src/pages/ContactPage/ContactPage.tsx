import { createStyles, Text, Title, SimpleGrid, Image, rem, Center } from '@mantine/core'

import { ContactIconsList } from './components/ContactIcons/ContactIcons'

import image from '../../images/contact.jpg'

const useStyles = createStyles(theme => ({
  wrapper: {
    minHeight: 600,
    boxSizing: 'border-box',
    padding: `calc(${theme.spacing.xl} * 3.5)`,

    [theme.fn.smallerThan('sm')]: {
      padding: `calc(${theme.spacing.xl} * 2.5)`
    }
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.black,
    lineHeight: 1
  },

  description: {
    color: theme.colors[theme.primaryColor][6],

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%'
    }
  },

  form: {
    backgroundColor: theme.white
  }
}))

const ContactPage = () => {
  const { classes } = useStyles()

  return (
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
  )
}

export default ContactPage
