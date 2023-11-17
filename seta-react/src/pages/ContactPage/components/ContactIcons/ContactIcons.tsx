import { SimpleGrid, Box } from '@mantine/core'

import ContactIconsList from '../ContactIconsList/ContactIconsList'

const ContactIcons = () => {
  return (
    <SimpleGrid cols={2} breakpoints={[{ maxWidth: 755, cols: 1 }]}>
      <Box
        sx={theme => ({
          padding: theme.spacing.xl,
          borderRadius: theme.radius.md,
          backgroundColor: theme.white
        })}
      >
        <ContactIconsList />
      </Box>

      <Box
        sx={theme => ({
          padding: theme.spacing.xl,
          borderRadius: theme.radius.md,
          backgroundImage: `linear-gradient(135deg, ${theme.colors[theme.primaryColor][6]} 0%, ${
            theme.colors[theme.primaryColor][6]
          } 100%)`
        })}
      >
        <ContactIconsList variant="white" />
      </Box>
    </SimpleGrid>
  )
}

export default ContactIcons
