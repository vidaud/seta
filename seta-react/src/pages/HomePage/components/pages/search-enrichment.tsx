import { Image, Progress, Text } from '@mantine/core'

import image6 from '~/images/page_6.png'

import { getStrength } from '../constants'
import { useStyles } from '../modal/style'

const SearchEnrichmentPage = () => {
  const { classes } = useStyles()

  return (
    <>
      <Text className={classes.titleModal}>
        In the search by terms or phrase it is possible to apply a wizard so the search can be
        enriched automatically.
      </Text>
      <br />
      <Image src={image6} />
      <Progress color="gray" value={getStrength(8, 6)} size="md" radius="xl" />
    </>
  )
}

export default SearchEnrichmentPage
