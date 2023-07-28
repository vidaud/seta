import { BiMessage } from 'react-icons/bi'
import { TfiExchangeVertical } from 'react-icons/tfi'

import ScrollModal from '~/components/ScrollModal/ScrollModal'

import type { ModalStateProps } from '~/types/lib-props'

type Props = {
  id?: string
  title: string
  message: string
  type?: string
} & ModalStateProps

const MessageModal = ({ title, type, message, ...props }: Props) => (
  <ScrollModal
    title={title}
    icon={type === 'message' ? <BiMessage /> : <TfiExchangeVertical />}
    {...props}
    style={{ whiteSpace: 'break-spaces' }}
  >
    {message}
  </ScrollModal>
)

export default MessageModal
