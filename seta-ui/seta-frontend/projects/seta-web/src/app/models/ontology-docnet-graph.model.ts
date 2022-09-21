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
	abstract: string
	date: string
	depth: number
	id: string
	source: string
	title: string

	constructor(data?: Partial<Node>) {
		super()
		Object.assign(this, data)
	}
}

export class OntologyDocnetGraph extends Resource {
	links: Link[]
	nodes: Node[]

	constructor(data?: Partial<OntologyDocnetGraph>) {
		super()
		Object.assign(this, data)
	}
}
