import { Flex, Loader } from '@mantine/core'

type Props = {
  margin?: string
  height?: string
}

const PageLoader = ({ margin = 'auto', height = '100vh' }: Props) => {
  return (
    <Flex align="center" justify="center" m={margin} h={height}>
      <Loader size="xl" />
    </Flex>
  )
}

export default PageLoader
