export class TreeInputModel {
  name: string;
  children?: TreeInputModel[];
  isExpanded?: boolean
  isDirectory?: boolean

  constructor(data?: Partial<TreeInputModel>) {
    Object.assign(this, data);
  }
}
