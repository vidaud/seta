// import { TreeNode } from "@circlon/angular-tree-component";
import { QueryModel } from "./query.model";
import { Resource } from "./resource.model";

export class MongoQueryModel extends Resource {
  public _id?: string
  public username?: string;
  public key?: string;
//   public value?: TreeNode[];
  // created_at?: string;
  // modified_at?: string;


  constructor(data?: Partial<MongoQueryModel>) {
    super();
    Object.assign(this, data);
  }
}