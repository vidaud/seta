import { Box, Text, ThemeIcon, createStyles } from '@mantine/core'

import type { ContactIconProps, ContactIconStyles } from '~/types/contact'

const useStyles = createStyles((theme, { variant }: ContactIconStyles) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    color: theme.white
  },

  icon: {
    marginRight: theme.spacing.md,
    backgroundImage:
      variant === 'gradient'
        ? `linear-gradient(135deg, ${theme.colors[theme.primaryColor][4]} 0%, ${
            theme.colors[theme.primaryColor][6]
          } 100%)`
        : 'none',
    backgroundColor: 'transparent'
  },

  title: {
    color: variant === 'gradient' ? theme.colors.gray[8] : theme.colors[theme.primaryColor][4]
  },

  description: {
    color: variant === 'gradient' ? theme.black : theme.white,
    fontSize: 22
  }
}))

const ContactIcon = ({
  icon: Icon,
  title,
  description,
  variant = 'gradient',
  className,
  ...others
}: ContactIconProps) => {
  const { classes, cx } = useStyles({ variant })

  return (
    <div className={cx(classes.wrapper, className)} {...others}>
      {variant === 'gradient' ? (
        <ThemeIcon size={40} radius="md" className={classes.icon}>
          <Icon size="1.5rem" />
        </ThemeIcon>
      ) : (
        <Box mr="md">
          <Icon size="1.5rem" />
        </Box>
      )}

      <div>
        <Text size="md" className={classes.title}>
          {title}
        </Text>
        <Text className={classes.description}>{description}</Text>
      </div>
    </div>
  )
}

export default ContactIcon
