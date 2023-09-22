import { Image, Progress, Text } from '@mantine/core'

import image2 from '~/images/page_2.png'

import { getStrength } from '../constants'
import { useStyles } from '../modal/style'

const CommunitiesPage = () => {
  const { classes } = useStyles()

  return (
    <>
      <Text className={classes.titleModal}>
        SeTA communities offers a shared place, where users can interact among them about specific
        areas of interest.
      </Text>
      <br />
      <Image src={image2} alt="Communities" />
      <Progress color="gray" value={getStrength(8, 2)} size="md" radius="xl" />
    </>
  )
}

export default CommunitiesPage
