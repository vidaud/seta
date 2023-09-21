import { Image, Progress, Text } from '@mantine/core'

import image3 from '~/images/page_3.png'

import { getStrength } from '../constants'
import { useStyles } from '../modal/style'

const CommunityMembershipPage = () => {
  const { classes } = useStyles()

  return (
    <>
      <Text className={classes.titleModal}>
        In SeTA there are two types of communities: Public Communities and Private Communities
      </Text>
      <br />
      <Image src={image3} alt="Communities" />
      <Progress color="gray" value={getStrength(8, 3)} size="md" radius="xl" />
    </>
  )
}

export default CommunityMembershipPage
