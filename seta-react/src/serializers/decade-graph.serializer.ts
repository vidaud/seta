import { DecadeGraph, Year } from '../models/decade-graph.model';
import { Serializer } from './serializer.interface';

export class DecadeGraphSerializer implements Serializer {
  fromJson(json: any): DecadeGraph {
    const decade = new DecadeGraph();
    decade.x = [];
    decade.y = [];
    decade.years = [];
    decade.x = [...json.x];
    decade.y = [...json.y];
    let id = 1;
    for (const [key, value] of Object.entries<string>(json.years)) {
      const year = new Year();
      year.id = id++;
    //   year.key = decade.x.find((val) => val.includes(key));
      year.value = parseInt(value, 10);
      decade.years.push(year);
    }
    return decade;
  }
  toJson(resource: DecadeGraph) {
    throw new Error(`Method not implemented.`);
  }
}