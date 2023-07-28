import { BiMessage } from 'react-icons/bi'

import ScrollModal from '~/components/ScrollModal/ScrollModal'

import type { ModalStateProps } from '~/types/lib-props'

type Props = {
  title: string
  message: string
} & ModalStateProps

const MessageModal = ({ title, message, ...props }: Props) => (
  <ScrollModal title={title} icon={<BiMessage />} {...props} style={{ whiteSpace: 'break-spaces' }}>
    {message}
  </ScrollModal>
)

export default MessageModal
