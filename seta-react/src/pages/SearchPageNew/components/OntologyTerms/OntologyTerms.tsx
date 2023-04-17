import { Divider, Flex, Text } from '@mantine/core'

import OntologyHeader from '../OntologyHeader'

type Props = {
  className?: string
}

const OntologyTerms = ({ className }: Props) => {
  return (
    <Flex className={className} direction="column">
      <OntologyHeader />
      <Divider color="gray.2" />
      <Text mt="sm">Ontology Terms</Text>
    </Flex>
  )
}

export default OntologyTerms
