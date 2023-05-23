import { useState } from 'react'
import {
  FileButton,
  Button,
  Group,
  Text,
  List,
  Paper,
  Grid,
  Textarea,
  createStyles
} from '@mantine/core'

const useStyles = createStyles(theme => ({
  taxonomy: {
    paddingTop: theme.spacing.xl
  }
}))

const FileUploadStep = () => {
  const { classes } = useStyles()
  const [files, setFiles] = useState<File[]>([])

  return (
    <>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx="auto">
        <Grid grow>
          <Grid.Col span={12}>
            <Text align="center">Upload document or Enter text to start searching documents</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group position="center">
              <FileButton onChange={setFiles} accept="image/png,image/jpeg" multiple>
                {props => <Button {...props}>Upload image</Button>}
              </FileButton>
            </Group>

            {files.length > 0 && (
              <Text size="sm" mt="sm">
                Picked files:
              </Text>
            )}

            <List size="sm" mt={5} withPadding>
              {files.map(file => (
                <List.Item key={file.name}>{file.name}</List.Item>
              ))}
            </List>
          </Grid.Col>
          <Grid.Col span={5}>
            <Textarea placeholder="Paste your text here" />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group position="center" className={classes.taxonomy}>
              <Button color="green"> Auto Taxonomy </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  )
}

export default FileUploadStep
