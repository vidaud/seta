import { createContext, useContext, useState } from 'react'
import { notifications } from '@mantine/notifications'

import type { ApplicationPermissions } from '~/api/user/applications-permissions'

export interface ApplicationContextValue {
  saveDisabled: boolean
  handleDisabled: (value: boolean) => void
  permModified: (initial: TrackProps, current: TrackProps) => boolean
  handleSavePermissions: (
    updatePermissionsMutation,
    allPerms: ApplicationPermissions[],
    resourceScope: ApplicationPermissions,
    selection: string[]
  ) => void
  replaceResourcePermissions: (
    allPerms: ApplicationPermissions[],
    resourceScope: ApplicationPermissions,
    selection: string[]
  ) => {
    resourceId: string
    scopes: string[]
  }[]
}

export type PermissionsRequest = {
  resourceId?: string
  scopes: string[] | null
}

type TrackProps = {
  resourceId: string
  scopes: string[]
}

export const ApplicationContext = createContext<ApplicationContextValue | undefined>(undefined)

export const ApplicationProvider = ({ children }) => {
  const [saveDisabled, setSaveDisabled] = useState(true)

  const replaceResourcePermissions = (
    allPerms: ApplicationPermissions[],
    resourceScope: ApplicationPermissions,
    selection: string[]
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objectToReplace: ApplicationPermissions | any = allPerms?.find(
      arrayItem => arrayItem.resourceId === resourceScope.resourceId
    )

    allPerms.concat(allPerms, objectToReplace)
    Object.assign(objectToReplace, { resourceId: resourceScope.resourceId, scopes: selection })
    const request = allPerms.map(({ resourceId, scopes }) => ({ resourceId, scopes }))

    return request
  }
  const handleSavePermissions = (
    updatePermissionsMutation,
    allPerms: ApplicationPermissions[],
    resourceScope: ApplicationPermissions,
    selection: string[]
  ) => {
    const request = replaceResourcePermissions(allPerms, resourceScope, selection)

    updatePermissionsMutation.mutate(request, {
      onSuccess: () => {
        notifications.show({
          title: 'Permissions updated!',
          message: `The application permissions were updated.`,
          color: 'blue',
          autoClose: 5000
        })
      },
      onError: error => {
        notifications.show({
          title: 'Update failed!',
          // message: 'The update of the application permissions failed. Please try again!',
          message: error?.response?.data?.msg
            ? error?.response?.data?.msg
            : error?.response?.data?.message,
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  const handleDisabled = value => {
    setSaveDisabled(value)
  }

  const permModified = (initial: TrackProps, current: TrackProps) => {
    if (initial.resourceId !== current.resourceId) {
      return true
    }

    if (initial.scopes.length !== current.scopes.length) {
      return true
    }

    return (
      JSON.stringify(initial.scopes.slice().sort()) !==
      JSON.stringify(current.scopes.slice().sort())
    )
  }

  const values: ApplicationContextValue | undefined = {
    saveDisabled: saveDisabled,
    handleDisabled: handleDisabled,
    permModified: permModified,
    handleSavePermissions: handleSavePermissions,
    replaceResourcePermissions: replaceResourcePermissions
  }

  return <ApplicationContext.Provider value={values}>{children}</ApplicationContext.Provider>
}

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext)

  if (context === undefined) {
    throw new Error('useApplicationContext must be used within a ApplicationProvider')
  }

  return context
}
