import { Code, Flex, List, Paper, Text, ThemeIcon, Title } from '@mantine/core'
import { IconNumber1, IconNumber2, IconNumber3 } from '@tabler/icons-react'

import Page from '../Page'

const GenerateKeyInstructions = () => {
  return (
    <Page>
      <Flex direction="column" align="left" style={{ margin: '0 5%' }}>
        <Title order={4}>RSA key</Title>
        <Text pt="md">
          You can access and write data in repositories on SeTA using RSA. When you connect via RSA,
          you authenticate using a private key file on your local machine.
        </Text>
        <Text pt="sm" italic>
          Note: RSA is just one example of SSH Keys that can be generated and used in SeTA for
          authentication.
        </Text>
        <Title order={4} pt="md">
          Generating a new RSA key
        </Title>
        <Text pt="md">
          You can generate a new RSA key on your local machine. After you generate the key, you can
          add the public key to your account on SeTA to enable authentication for SeTA operations
          over RSA
        </Text>
        <List spacing="xs" size="sm" center>
          <List.Item
            icon={
              <ThemeIcon color="gray" size={24} radius="xl">
                <IconNumber1 size="1rem" />
              </ThemeIcon>
            }
          >
            Open Git Bash.
          </List.Item>
          <List.Item
            pb="md"
            icon={
              <ThemeIcon color="gray" size={24} radius="xl">
                <IconNumber2 size="1rem" />
              </ThemeIcon>
            }
          >
            Paste the text below, replacing the email used in the example with your email address.
          </List.Item>
          <Paper ml="2.25rem">
            <Code p="sm">ssh-keygen -m PEM -t rsa -C "your_email@example.com"</Code>
            <Text mt="md" mb="md">
              When you're prompted to "Enter a file in which to save the key", you can press Enter
              to accept the default file location. Please note that if you created RSA keys
              previously, ssh-keygen may ask you to rewrite another key, in which case we recommend
              creating a custom-named RSA key. To do so, type the default file location and replace
              id_rsa with your custom key name.
            </Text>
            <Code p="sm">
              {'> '}Enter a file in which to save the key (/c/Users/YOU/.ssh/id_rsa):[Press enter]
            </Code>
          </Paper>
          <List.Item
            pt="md"
            pb="md"
            icon={
              <ThemeIcon color="gray" size={24} radius="xl">
                <IconNumber3 size="1rem" />
              </ThemeIcon>
            }
          >
            At the prompt, type a secure passphrase.
          </List.Item>
          <Paper ml="2.25rem" display="inline-grid">
            <Code p="sm">
              {'> '} Enter passphrase (empty for no passphrase): [Type a passphrase]
            </Code>
            <Code p="sm">{'> '} Enter same passphrase again: [Type passphrase again]</Code>
          </Paper>
          <Title order={4} pt="md" pb="md">
            Add the RSA public key to your account on SeTA.
          </Title>
          <List.Item
            icon={
              <ThemeIcon color="gray" size={24} radius="xl">
                <IconNumber1 size="1rem" />
              </ThemeIcon>
            }
          >
            Navigate to the folder that you created in step 2b. Open the <Code>rsakey.pub</Code>{' '}
            file for editing.
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="gray" size={24} radius="xl">
                <IconNumber2 size="1rem" />
              </ThemeIcon>
            }
          >
            Locate the public key beginning with rsa and copy the key.
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="gray" size={24} radius="xl">
                <IconNumber3 size="1rem" />
              </ThemeIcon>
            }
          >
            Navigate in SeTA to RSA page <Code>/profile/auth-key</Code> put the copied key into the
            textbox. Then click Save to save the key.
          </List.Item>
        </List>
      </Flex>
    </Page>
  )
}

export default GenerateKeyInstructions
