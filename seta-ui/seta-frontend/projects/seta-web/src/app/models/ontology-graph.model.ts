import { Resource } from './resource.model'

export class Link extends Resource {
	source: string
	target: string
	value: number

	constructor(data?: Partial<Link>) {
		super()
		Object.assign(this, data)
	}
}

export class Node extends Resource {
	depth: string
	graphSize: number
	id: string
	size: number

	constructor(data?: Partial<Node>) {
		super()
		Object.assign(this, data)
	}
}

export class OntologyGraph extends Resource {
	links: Array<Link>
	nodes: Array<Node>

	constructor(data?: Partial<OntologyGraph>) {
		super()
		Object.assign(this, data)
	}
}
