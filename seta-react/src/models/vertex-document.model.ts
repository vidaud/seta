import { Resource } from './resource.model'

export class VertexDocument extends Resource {
	similarDocId: string
	similarity: string
	source: string
	title: string

	constructor(data?: Partial<VertexDocument>) {
		super()
		Object.assign(this, data)
	}
}