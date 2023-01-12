import { Resource } from '../models/resource.model'

export interface GenericModelConstructor {
  new (property: string): GenericModel;
}

export interface GenericModel {
}