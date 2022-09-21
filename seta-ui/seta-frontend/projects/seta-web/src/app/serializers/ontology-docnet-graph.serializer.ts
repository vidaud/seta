import { Link, Node, OntologyDocnetGraph } from '../models/ontology-docnet-graph.model';
import { Serializer } from './serializer.interface';
import { environment } from '../../environments/environment';

export class OntologyDocnetGraphSerializer implements Serializer {
  fromJson(json: any): OntologyDocnetGraph {
    const regex = environment._regex;
    const graph = new OntologyDocnetGraph();
    const links = [];
    json.links.forEach((data) => {
      const linkInt = new Link();
      linkInt.source = data.source.replace(regex, ` `);
      linkInt.target = data.target.replace(regex, ` `);
      linkInt.value = data.value;
      links.push(linkInt);
        });


    const nodes = [];
    json.nodes.forEach((node) => {
      const nodeInt = new Node();
      nodeInt.abstract = node.abstract;
      nodeInt.date = node.date;
      nodeInt.depth = node.depth;
      nodeInt.id = node.id.replace(regex, ` `);
      nodeInt.source = node.source;
      nodeInt.title = node.title;
      nodes.push(nodeInt);
    });
    graph.links = links;
    graph.nodes = nodes;
    return graph;
  }

  toJson(graph: OntologyDocnetGraph): any {
    return {};
  }
}
