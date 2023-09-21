import { Image, Progress, Text } from '@mantine/core'

import image7 from '~/images/page_7.png'

import { getStrength } from '../constants'
import { useStyles } from '../modal/style'

const DocumentUploadPage = () => {
  const { classes } = useStyles()

  return (
    <>
      <Text className={classes.titleModal}>
        With the option of search by document or text, you can upload the elements with the cloud
        icon.
      </Text>
      <br />
      <Image src={image7} alt="Search" />
      <Progress color="gray" value={getStrength(8, 7)} size="md" radius="xl" />
    </>
  )
}

export default DocumentUploadPage
