import { Resource } from './resource.model'

export class Year extends Resource {
	key: string
	value: number

	constructor(data?: Partial<Year>) {
		super()
		Object.assign(this, data)
	}
}

export class DecadeGraph extends Resource {
	x: Array<string>
	y: Array<number>
	years: Year[]

	constructor(data?: Partial<DecadeGraph>) {
		super()
		Object.assign(this, data)
	}
}
