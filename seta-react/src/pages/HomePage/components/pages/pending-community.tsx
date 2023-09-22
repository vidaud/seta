import { Image, Progress, Text } from '@mantine/core'

import image4 from '~/images/page_4.png'

import { getStrength } from '../constants'
import { useStyles } from '../modal/style'

const PendingCommunityPage = () => {
  const { classes } = useStyles()

  return (
    <>
      <Text className={classes.titleModal}>
        After the request, the status remains “Pending” until the Community Owner accepts the
        request.
      </Text>
      <br />
      <Image src={image4} />
      <Progress color="gray" value={getStrength(8, 4)} size="md" radius="xl" />
    </>
  )
}

export default PendingCommunityPage
