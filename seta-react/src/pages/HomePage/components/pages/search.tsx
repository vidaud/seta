import { Image, Progress, Text } from '@mantine/core'

import image5 from '~/images/page_5.png'

import { getStrength } from '../constants'
import { useStyles } from '../modal/style'

const SearchPage = () => {
  const { classes } = useStyles()

  return (
    <>
      <Text className={classes.titleModal}>
        The search tool allows the access to the community data.
      </Text>
      <br />
      <Image src={image5} />
      <Progress color="gray" value={getStrength(8, 5)} size="md" radius="xl" />
    </>
  )
}

export default SearchPage
