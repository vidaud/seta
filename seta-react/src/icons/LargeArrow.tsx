import { createSvgIcon } from '~/utils/svg-utils'

const LargeArrow = createSvgIcon(
  'LargeArrow',
  { viewBox: '0 0 64 102', width: 64, height: 102 },
  <path
    fill="currentColor"
    fillRule="evenodd"
    stroke="strokeColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    d="m.672 34.531-.297-.656 35.719-32.64L62.609 42.03l-.437.563-22.656-7.89.125 6.64-.625 11.328-1.078 8.187-1.5 7.61-2.126 7.937-2.89 8.031-2.406 5.329-3.594 6.5-2.89 3.89-1.548.922-1.218-.61-.657-2.421-.25-9.89-.484-.844-2.328.296-8.469 2.844-2 .219-1.281-.656-.063-1.579.579-1.406 7.203-12.719 6.25-14.374h-.016l4.313-13.547 2.89-14.485Z"
  />
)

export default LargeArrow
