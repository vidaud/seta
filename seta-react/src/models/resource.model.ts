export class Resource {
  public id?: number | string

  constructor(data?: Partial<Resource>) {
    Object.assign(this, data)
  }
}
