import { Resource } from '../models/resource.model'

export interface Serializer {
	fromJson(json: any): Resource
	toJson(resource: Resource): any
}