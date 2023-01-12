import { Resource } from "./resource.model";

export class EurovocThesaurusModel extends Resource {
  public domCode: string;
  public domLabel: string;
  public mthCode: string;
  public mthLabel: string;
  public ttLabel: string;
  public ttCode: string;
  public conceptLable: string;
  public conceptCode: string;


  constructor(data?: Partial<EurovocThesaurusModel>) {
    super();
    Object.assign(this, data);
  }
}