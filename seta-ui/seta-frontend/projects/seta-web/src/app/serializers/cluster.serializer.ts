
import { environment } from '../../environments/environment';
import { Cluster } from '../models/cluster.model';
import { Serializer } from './serializer.interface';

export class ClusterSerializer implements Serializer {
  regex = environment._regex;
  fromJson(json: any): Cluster {
    const cluster = new Cluster();
    cluster.cluster = json.cluster;
    cluster.words = json.words.map((word) => word.replace(this.regex, ` `));
    return cluster;
  }
  toJson(resource: Cluster) {
    throw new Error(`Method not implemented.`);
  }
}
