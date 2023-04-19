import { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'

import { defaultNoPublicKeyMessage } from '../../common/constants'
import type { User } from '../../models/user.model'
import RestService from '../../services/rest.service'
import rsaKeysService from '../../services/rsa-keys.service'
import storageService from '../../services/storage.service'

import './style.css'

function ProfilePage(props) {
  const [publicKey, setpublicKey] = useState<string | undefined>()
  let currentUser: User | any = null

  if (storageService.isLoggedIn()) {
    currentUser = storageService.getUser()
    RestService.getPublicRsaKey().then(r => {
      setpublicKey(r.data.value)
    })
  }

  function deleteUser() {
    RestService.deleteCurrentUserAccount()
  }

  function generateRsaKeys() {
    rsaKeysService.generateRsaKeys().then(r => {
      downLoadFile(r.data['privateKey'], 'text/plain', `id_rsa`)
      setpublicKey(r.data.publicKey)
    })
  }

  function deleteRsaKey() {
    rsaKeysService.deleteRsaKeys().then(r => {
      setpublicKey(defaultNoPublicKeyMessage)
    })
  }

  function downLoadFile(data: any, headers: any, filename: string) {
    const link = document.createElement(`a`)
    const blob = new Blob([data], {
      type: typeof headers === 'object' ? headers.get(`Content-Type`) : headers
    })

    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(link.href)
  }

  return (
    <div className="page">
      <div className="card">
        <div>
          <div className="p-fluid grid">
            <div className="field col-12 md:col-6">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user" />
                </span>
                <span className="p-float-label">
                  <InputText id="email" type="text" value={currentUser.email} disabled />
                  <label htmlFor="email">Email</label>
                </span>
              </div>
            </div>
            <div className="field col-12 md:col-6">
              <span className="p-float-label">
                <InputText id="username" type="text" value={currentUser.username} disabled />
                <label htmlFor="username">Username</label>
              </span>
            </div>
            <div className="field col-12 md:col-6">
              <span className="p-float-label">
                <InputText id="firstName" type="text" value={currentUser.firstName} disabled />
                <label htmlFor="FirstName">First Name</label>
              </span>
            </div>
            <div className="field col-12 md:col-6">
              <span className="p-float-label">
                <InputText id="lastName" type="text" value={currentUser.lastName} disabled />
                <label htmlFor="lastName">Last Name</label>
              </span>
            </div>
            <div className="publicKey">
              <div className="field col-12 md:col-6">
                <span className="p-float-label">
                  <InputTextarea
                    id="publicKey"
                    value={publicKey ? publicKey : defaultNoPublicKeyMessage}
                    rows={22}
                    cols={50}
                    autoResize
                    disabled
                  />
                  <label htmlFor="publicKey">Public Key</label>
                </span>
              </div>
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text"
                aria-label="Delete Public Key"
                onClick={deleteRsaKey}
              />
              <Button
                icon="pi pi-refresh"
                className="p-button-rounded p-button-text"
                aria-label="Refresh Public Key"
                onClick={generateRsaKeys}
              />
            </div>
          </div>
          <div>
            <Button icon="pi pi-user" className="p-button-icon-left" onClick={deleteUser}>
              <span>Delete User</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
