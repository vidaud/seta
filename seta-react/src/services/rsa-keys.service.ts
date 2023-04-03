import RestService from './rest.service'

class RsaKeysService {
  servicedComponent: any

  public generateRsaKeys(): any {
    return RestService.generateRsaKeys()
  }

  public deleteRsaKeys(): any {
    return RestService.deleteRsaKeys() as any
  }
}

export default new RsaKeysService()
