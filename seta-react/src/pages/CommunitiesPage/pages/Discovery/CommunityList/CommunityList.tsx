import CommunityList from '../../../components/Discovery/CommunityList/CommunityList'
import './style.css'

// const useStyles = createStyles(theme => ({
//   mainLinkIcon: {
//     marginRight: theme.spacing.sm,
//     color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6]
//   },
//   mainLinkInner: {
//     display: 'flex',
//     alignItems: 'center',
//     flex: 1
//   },
//   mainLink: {
//     display: 'flex',
//     alignItems: 'center',
//     fontSize: theme.fontSizes.xs,
//     paddingBottom: `${theme.spacing.xs}`,
//     borderRadius: theme.radius.sm,
//     fontWeight: 500,
//     color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7]
//   }
// }))

const CommunityListPage = () => {
  // const data = useCommunities()
  // const { classes } = useStyles()

  return (
    <>
      {/* <Group position="right">
        <UnstyledButton className={classes.mainLink}>
          <Tooltip label="Membership List">
            <div className={classes.mainLinkInner}>
              <IconUsers size={20} stroke={1.5} className={classes.mainLinkIcon} />
            </div>
          </Tooltip>
        </UnstyledButton>
      </Group> */}
      <CommunityList />
    </>
  )
}

export default CommunityListPage
