import { Group, Image, Text, Title } from '@mantine/core'

// import document_search from '~/images/document_search.png'
import user_profile from '~/images/user_profile.png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  },
  {
    target: '#login_page',
    placement: 'right',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Login Providers
        </Title>
        <Text>
          Please log in through the <strong>EU Login</strong> by clicking on the button below and
          follow instructions.{' '}
          <i>EU Login is the European Commission's user authentication service.</i>
        </Text>
        <Text pt="xs">Or use other third-party authenticators (ex: GitHub) if available.</Text>
      </div>
    )
  }
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const steps: any = [
  {
    target: '.menu-items',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} color="#228be6" mt="sm">
          Welcome to SeTA!
        </Title>
        <Text>
          This navigation menu facilitates browsing through the website. Clicking on any menu item
          will redirect you to different pages.
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
            To access your profile, simply click on the user icon. If you have administrator
            privileges, the option to open the administration console will be available. You can
            also log out from this section.
          </Text>
          <Image alt="User Profile" src={user_profile} width={160} />
        </Group>
      </div>
    )
  },
  {
    target: '#datasource-tab',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Data Sources Page
        </Title>
        <Text>
          Explore the comprehensive list of available data sources accessible to all users.
        </Text>
      </div>
    )
  },
  {
    target: '#datasource-list',
    placement: 'top',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Data Source List
        </Title>
        <Text>
          Each data source includes essential details such as title, organization, ID, themes, and
          more. Customize searchability based on your preferences for enhanced usability:
          <strong> searchable</strong> or<strong> not searchable</strong> data source
        </Text>
      </div>
    )
  },
  {
    target: '#apply_filters',
    content: (
      <div style={{ textAlign: 'left' }}>
        <Title order={3} mb="sm" color="#228be6">
          Data Sources Filters
        </Title>
        <Text>
          Users can refine data sources via a dropdown, selecting between 'searchable' and
          'unsearchable.' Additionally, they can filter by other fields by inputting specific
          criteria into the search box.
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
          Selecting the <strong>Search</strong> menu item will open the search page, granting access
          to the data sources through the search tool.
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
          <Text>Upload your document or text to initiate a search for relevant results.</Text>
          {/* <Image alt="Document/Text Search" src={document_search} width={200} /> */}
        </Group>
        <Text>
          After uploading the document or entering the text, you'll be able to view the uploaded
          objects.
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
          These are the documents matching your search query and applied filters. You can easily
          screen and refine the search results using the provided tool.
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
