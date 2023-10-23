import { Group, Image, Text, Title } from '@mantine/core'

import document_search from '~/images/document_search.png'
import notifications from '~/images/notifications.png'
import user_profile from '~/images/user_profile.png'

export const no_login_steps: any = [
  {
    target: '.menu-items',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} color="#228be6" mt="sm">
          Welcome to SeTA!
        </Title>
        <Text>
          This is the navigation menu of the website. Clicking on each of the menu items will
          redirect you to the other pages.
        </Text>
      </div>
    )
  },
  {
    target: '#documentation',
    placement: 'right',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          SeTA Documentation
        </Title>
        <Text>
          From here you can be redirected to the external documentation website. In this guide
          (documentation), you will learn the steps necessary to configure your environment and how
          to use the application.
        </Text>
      </div>
    )
  },
  {
    target: '.login-button',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Login Page
        </Title>
        <Text>Click on the button to login into SeTA and start exploring the website.</Text>
      </div>
    )
  }
]

export const steps: any = [
  {
    target: '.menu-items',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} color="#228be6" mt="sm">
          Welcome to SeTA!
        </Title>
        <Text>
          This is the navigation menu of the website. Clicking on each of the menu items will
          redirect you to the other pages.
        </Text>
      </div>
    )
  },
  {
    target: '.login-button',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          User Profile
        </Title>
        <Group sx={{ justifyContent: 'center' }} pb="xs">
          <Text>
            Click on the user icon to open your profile. If you have an administrator account you we
            be able to open the administration console. The user can also log out from this section.
          </Text>
          <Image alt="User Profile" src={user_profile} width={160} />
        </Group>
        <Title order={3} mb="sm" color="#228be6">
          Notifications
        </Title>
        <Group sx={{ justifyContent: 'center' }}>
          <Text>
            Clicking on the notification icon the dropdown with the list with notification type and
            number of notifications for each type.
          </Text>
          <Image alt="Notifications" src={notifications} width={160} />
        </Group>
      </div>
    )
  },
  {
    target: '#community-tab',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Communities Page
        </Title>
        <Text>
          SeTA communities offers a shared place, where users can interact among them about specific
          areas of interest.
        </Text>
        <Text>
          Click on <strong>Community</strong> menu item to open the search page. You will be able to
          explore the available list communities and become a member.
        </Text>
        <Text>
          In SeTA there are two types of communities: <strong>Public Communities</strong> and
          <strong> Private Communities</strong>.
        </Text>
      </div>
    )
  },
  {
    target: '#new_community',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Create Community
        </Title>
        <Text>
          Click on <strong>New Community +</strong> to create your community.
        </Text>
      </div>
    )
  },
  // {
  //   target: '#apply_filters',
  //   content: (
  //     <div style={{ textAlign: 'left' }}>
  //       <Title order={3} mb="sm" color="#228be6">
  //         Customize Search
  //       </Title>
  //       <Text>Select Membership type or/and Status of membership or/and search by field.</Text>
  //     </div>
  //   )
  // },
  {
    target: '#join_community',
    placement: 'left',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          JOIN / LEAVE Community
        </Title>
        <Text>
          <strong>JOIN Button</strong>: Click on <strong>JOIN</strong> button to become member of
          the community. For restricted communities you need to send a request and wait for the
          approval. After the request, the status remains “Pending” until the Community Owner
          accepts the request.
        </Text>
        <Text>
          <strong>LEAVE Button</strong>: Click on <strong>LEAVE </strong>button if you don't want to
          be a community member anymore.
        </Text>
        <Text>
          <strong> Note</strong>:
          <i>
            {' '}
            By leaving communities that you are the only owner/manager, all resources will be
            allocated as orphan and could not be reused by other users.
          </i>
        </Text>
      </div>
    )
  },
  {
    target: '#resource_list',
    placement: 'right',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Resource List
        </Title>
        <Text>
          Here you can find a list of resources available from the communities you have joined
          and/or resources you have created within your communities.
        </Text>
        <Text>
          To create a resource you need to have the right permissions on that specific community.
          You can also make the resource <strong>searchable</strong> or
          <strong> not searchable</strong>, <strong>update</strong> or even <strong>delete</strong>{' '}
          it.
        </Text>
      </div>
    )
  },
  {
    target: '#search-tab',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Search Page
        </Title>
        <Text>
          Clicking the <strong>Search</strong> menu item will open the search page. The search tool
          allows the access to the community data.
        </Text>
      </div>
    )
  },
  {
    target: '#search-query',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Search box
        </Title>
        <Text>
          Start typing a/a few search term(s) in search box and then press <strong>Search </strong>
          button to find documents.
        </Text>
        <Text>
          In the search by terms or phrase it is possible to apply a wizard so the search can be
          enriched automatically.
        </Text>
      </div>
    )
  },
  {
    target: '#search-upload',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Document/Text Upload
        </Title>
        <Group sx={{ justifyContent: 'center' }}>
          <Text>Upload your document or text and start searching for relevant results.</Text>
          <Image alt="Document/Text Search" src={document_search} width={200} />
        </Group>
        <Text>
          After uploading the document or putting the text, we can see the uploaded objects.
        </Text>
      </div>
    )
  },
  {
    target: '#document-list',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Document Results
        </Title>
        <Text>
          List of documents relevant to the query searched and filters applied. The search results
          can be easily screened and filtered by the user with the help of the tool.
        </Text>
      </div>
    )
  },
  {
    target: '#tab-filters',
    placement: 'right',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Filters
        </Title>
        <Text>In this section you can refine the search of results as following: </Text>
        <Text>- Switch button ON/OFF to unable/disable multiple chunk search.</Text>
        <Text>- Use the slider to set the range of years.</Text>
        <Text>- Check/Uncheck data sources to include in your query.</Text>
        <Text>
          - Enter <i>name</i> and <i>value</i> in <strong>Other</strong> section into filters to
          restrict the search.
        </Text>
        <Text>
          You can view all filters by clicking on
          <i> Apply Filters </i>on top of the section (is clickable/active after you have added at
          least one filter).
        </Text>
      </div>
    )
  }
]
