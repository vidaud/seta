import { Box, Title, Text, Button, Container, Group } from '@mantine/core'

import * as S from './styles'

const UnderConstruction = () => {
  return (
    <Container css={S.root}>
      <Box css={S.label}>!</Box>
      <Title css={S.title}>Under Construction</Title>
      <Text color="dimmed" size="lg" align="center" css={S.description}>
        This page is comming soon
      </Text>
      <Group position="center">
        <Button variant="subtle" size="md" component="a" href="/">
          Take me to home page
        </Button>
      </Group>
    </Container>
  )
}

export default UnderConstruction
