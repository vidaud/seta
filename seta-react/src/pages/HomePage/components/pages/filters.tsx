import { Image, Progress, Text } from '@mantine/core'

import image8 from '~/images/page_8.png'

import { getStrength } from '../constants'
import { useStyles } from '../modal/style'

const FiltersPage = () => {
  const { classes } = useStyles()

  return (
    <>
      <Text className={classes.titleModal}>
        The search results can be easily screened and filtered by the user with the help of the
        tool.
      </Text>
      <br />
      <Image src={image8} alt="Search" />
      <Progress color="gray" value={getStrength(8, 8)} size="md" radius="xl" />
    </>
  )
}

export default FiltersPage
