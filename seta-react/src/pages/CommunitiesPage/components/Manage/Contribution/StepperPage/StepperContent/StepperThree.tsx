import React, { useContext, useEffect, useState } from 'react'
import { Box, Group, Text, Title, createStyles, Radio, Flex, Select, Paper } from '@mantine/core'

import type { DocumentsOptions, DocumentsResponse } from '~/api/embeddings/taxonomy'

import { useDocuments } from '../../../../../../../api/embeddings/taxonomy'
import TaxonomyTree from '../../../../../../SearchPageNew/components/documents/DocumentInfo/components/TaxonomyTree/TaxonomyTree'
import { Context } from '../context/Context'

const useStyles = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start'
  },
  radio: {
    width: '100%'
  },
  content: {
    marginLeft: '5%'
  },
  label: {
    textAlign: 'left'
  }
})

export const StepperThree = () => {
  const { embeddings, taxonomy, handleTaxonomyChange } = useContext(Context)
  const [taxValue, setTaxValue] = useState<any>()
  const [showTree, setShowTree] = useState<boolean>(false)
  const [searchOptions, setSearchOptions] = useState<DocumentsOptions | undefined>({
    semantic_sort_id_list: embeddings.vector
  })
  const { classes } = useStyles()
  const [value, setValue] = useState('select')

  const onDocumentsLoaded = (response: DocumentsResponse) => {
    const { taxonomies } = response.aggregations ?? {}

    setTaxValue(taxonomies)
    console.log(response)
  }

  const { data } = useDocuments({
    searchOptions,
    onSuccess: onDocumentsLoaded
  })

  useEffect(() => {
    if (data) {
      console.log(data)
      console.log(taxValue)
    }
  }, [data, taxValue])

  return (
    <>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto">
        <Group className={classes.container}>
          {/** form header */}
          <Box>
            <Title order={2} color="hsl(213, 96%, 18%)">
              Taxonomy
            </Title>
            <Text mt={7} fz={{ base: 17, md: 15 }} w="100%" color="hsl(231, 11%, 63%)" fw={400}>
              Select taxonomy from the select options or create a custom one
            </Text>
          </Box>
          {/** content body */}
          <Group w="100%">
            <Flex className={classes.radio}>
              {/** stepper step */}
              <Box>
                <Radio.Group value={value} onChange={setValue} name="taxonomy" withAsterisk>
                  <Radio value="select" label="Select Taxonomy" />
                  <Radio value="custom" label="Create Custom Taxonomy" />
                </Radio.Group>
              </Box>

              {/** stepper content */}
              <Box className={classes.content}>
                {value === 'select' ? (
                  <Group>
                    <Select
                      className={classes.label}
                      label="Select taxonomy option"
                      name="taxonomy"
                      value={taxonomy}
                      data={taxValue ? taxValue : []}
                      onChange={() => {
                        handleTaxonomyChange
                        setShowTree(true)
                      }}
                      withAsterisk
                    />
                    {showTree ? <TaxonomyTree taxonomy={taxValue} /> : null}
                  </Group>
                ) : (
                  <div>Create</div>
                )}
              </Box>
            </Flex>
          </Group>
        </Group>
      </Paper>
    </>
  )
}
