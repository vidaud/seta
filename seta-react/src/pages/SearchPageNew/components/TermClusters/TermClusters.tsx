import { Divider, Flex, ScrollArea } from '@mantine/core'

import TermsCluster from '~/pages/SearchPageNew/components/TermClusters/components/TermsCluster/TermsCluster'

import OntologyHeader from '../OntologyHeader'

const data: string[][] = [
  [
    'tests',
    'preliminary tests',
    'laboratory tests',
    'several tests',
    'trials',
    'initial tests',
    'experiments',
    'experimental tests',
    'test runs',
    'preliminary experiments',
    'preliminary trials',
    'laboratory trials',
    'laboratory experiments',
    'field tests',
    'laboratory investigations',
    'several experiments',
    'several trials',
    'extensive tests',
    'industrial trials',
    'experimental trials',
    'pilot tests',
    'initial trials',
    'initial experiments'
  ],
  ['experiment', 'measurement campaign', 'experimental campaign', 'experimental programme'],
  [
    'test programme',
    'test program',
    'experimental program',
    'test matrix',
    'experimental work',
    'test work',
    'testing program',
    'parametric study'
  ],
  ['test series', 'test campaign'],
  ['field test', 'field trial', 'field testing', 'pilot test', 'field trials'],
  ['test run', 'test period'],
  ['trial'],
  ['testing', 'validation', 'laboratory testing', 'screening', 'quality control'],
  [
    'test procedure',
    'testing procedure',
    'test procedures',
    'test method',
    'test protocol',
    'test cycle',
    'measurement procedure',
    'testing method',
    'calibration procedure'
  ],
  ['following tests', 'additional tests'],
  ['laboratory test', 'standard test', 'new test'],
  ['all the tests', 'all the experiments', 'different tests'],
  [
    'further tests',
    'further investigations',
    'further experiments',
    'further trials',
    'additional experiments'
  ]
]

type Props = {
  className?: string
}

const OntologyTerms = ({ className }: Props) => {
  return (
    <Flex className={className} direction="column">
      <OntologyHeader />
      <Divider color="gray.2" />

      <ScrollArea.Autosize mah={330} type="scroll" mt="md">
        {data.map((terms, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <TermsCluster key={index} terms={terms} />
        ))}
      </ScrollArea.Autosize>
    </Flex>
  )
}

export default OntologyTerms
