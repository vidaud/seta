import { Link, Node, OntologyGraph } from '../models/ontology-graph.model';
import { Serializer } from './serializer.interface';
import { environment } from '../environments/environment';

export class OntologyGraphSerializer implements Serializer {
  regex = environment._regex;
  fromJson(json: any): OntologyGraph {
    const graph = new OntologyGraph();
    const links = [];
    json.links.forEach((data) => {
      const linkInt = new Link();
      linkInt.source = data.source.replace(this.regex, ` `);
      linkInt.target = data.target.replace(this.regex, ` `);
      linkInt.value = data.value;
    //   links.push(linkInt);
    });
    const nodes = [];
    json.nodes.forEach((node) => {
      const nodeInt = new Node();
      nodeInt.depth = node.depth;
      nodeInt.graphSize = node.graph_size;
      nodeInt.id = node.id.replace(this.regex, ` `);
      nodeInt.size = node.size;
    //   nodes.push(nodeInt);
    });
    graph.links = links;
    graph.nodes = nodes;
    return graph;
  }

  toJson(graph: OntologyGraph): any {
    return {};
  }
}