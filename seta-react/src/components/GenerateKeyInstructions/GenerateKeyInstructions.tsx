import { Text, Title } from '@mantine/core'

import Page from '../Page'

const GenerateKeyInstructions = () => {
  return (
    <Page>
      <Title>About SSH key</Title>
      <Text>
        You can access and write data in repositories on SeTA using SSH (Secure Shell Protocol).
        When you connect via SSH, you authenticate using a private key file on your local machine.
      </Text>
      <Title>Generating a new SSH key</Title>
      <Text>
        You can generate a new SSH key on your local machine. After you generate the key, you can
        add the public key to your account on SeTA to enable authentication for SeTA operations over
        SSH
      </Text>
    </Page>
  )
}

export default GenerateKeyInstructions
