import { Vertex } from '../models/vertex.model';
import { Serializer } from './serializer.interface';

export class VertexSerializer implements Serializer {
  fromJson(json: any): Vertex {
    const vertex = new Vertex();
    if (json.id) {
      vertex.id = json.id;
    }
    vertex.cardinality = json.cardinality;
    vertex.similarWord = json.similar_word;
    vertex.similarity = json.similarity;
    return vertex;
  }


  toJson(vertex: Vertex): any {
    const json: any = {
      cardinality: vertex.cardinality,
      similar_word: vertex.similarWord,
      similarity: vertex.similarity
    };
    if (vertex.id) {
      json.id = vertex.id;
    }
    return json;
  }

}