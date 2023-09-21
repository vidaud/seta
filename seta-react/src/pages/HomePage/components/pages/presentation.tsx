import { Image, Progress, Text } from '@mantine/core'

import image1 from '~/images/page_1.png'

import { getStrength } from '../constants'
import { useStyles } from '../modal/style'

const PresentationPage = () => {
  const { classes } = useStyles()

  return (
    <>
      <Text className={classes.titleModal}> Welcome to SeTA! </Text>
      <br />
      <Image src={image1} alt="Presentation" />
      <Progress color="gray" value={getStrength(8, 1)} size="md" radius="xl" />
    </>
  )
}

export default PresentationPage
