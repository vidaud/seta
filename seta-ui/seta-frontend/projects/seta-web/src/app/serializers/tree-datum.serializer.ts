import { TreeDatum } from "../models/eurlexMetadataDto.model";
import { Serializer } from "./serializer.interface";

export class TreeDatumSerializer implements Serializer {
  fromJson(json: any): TreeDatum {
    const treeDatum = new TreeDatum()
    if (json.label) {
      treeDatum.label = json.label
    }
    if (json.data) {
      treeDatum.data = json.data
    }
    if (json.icon) {
      treeDatum.icon = json.icon
    }
    if (json.expandedIcon) {
      treeDatum.expandedIcon = json.expandedIcon
    }
    if (json.collapsedIcon) {
      treeDatum.collapsedIcon = json.collapsedIcon
    }
    if (json.children) {
      treeDatum.children = json.children.map((child) => { this.fromJson(child) })
    }
    if (json.leaf) {
      treeDatum.leaf = json.leaf
    }
    if (json.expanded) {
      treeDatum.expanded = json.expanded
    }
    if (json.type) {
      treeDatum.type = json.type
    }
    if (json.parent) {
      treeDatum.parent = this.fromJson(json.parent)
    }
    if (json.partialSelected) {
      treeDatum.partialSelected = json.partialSelected
    }
    if (json.styleClass) {
      treeDatum.styleClass = json.styleClass
    }
    if (json.draggable) {
      treeDatum.draggable = json.draggable
    }
    if (json.droppable) {
      treeDatum.droppable = json.droppable
    }
    if (json.selectable) {
      treeDatum.selectable = json.selectable
    }
    if (json.key) {
      treeDatum.key = json.key
    }
    if (json.notation) {
      treeDatum.notation = json.notation
    }
    if (json.domain_mts) {
      treeDatum.domain_mts = json.domain_mts
    }
    if (json.uuid) {
      treeDatum.uuid = json.uuid
    }
    return treeDatum
  }

  toJson(resource: TreeDatum): string  {
    let treeDatumString = '{' 
    if (resource.label) {
      treeDatumString = treeDatumString + `label: ${resource.label}`
    }
    if (resource.data) {
      treeDatumString = treeDatumString + `data: ${resource.data}`
    }
    if (resource.icon) {
      treeDatumString = treeDatumString + `icon: ${resource.icon}`
    }
    if (resource.expandedIcon) {
      treeDatumString = treeDatumString + `expandedIcon: ${resource.expandedIcon}`
    }
    if (resource.collapsedIcon) {
      treeDatumString = treeDatumString + `collapsedIcon: ${resource.collapsedIcon}`
    }
    if (resource.children) {
      treeDatumString = treeDatumString + `children: ${resource.children.map((child) => this.toJson(child))}`
    }
    if (resource.leaf) {
      treeDatumString = treeDatumString + `leaf: ${resource.leaf}`
    }
    if (resource.expanded) {
      treeDatumString = treeDatumString + `expanded: ${resource.expanded}`
    }
    if (resource.type) {
      treeDatumString = treeDatumString + `type: ${resource.type}`
    }
    if (resource.parent) {
      treeDatumString = treeDatumString + `parent: ${this.toJson(resource.parent)}`
    }
    if (resource.partialSelected) {
      treeDatumString = treeDatumString + `partialSelected: ${resource.partialSelected}`
    }
    if (resource.styleClass) {
      treeDatumString = treeDatumString + `styleClass: ${resource.styleClass}`
    }
    if (resource.draggable) {
      treeDatumString = treeDatumString + `draggable: ${resource.draggable}`
    }
    if (resource.droppable) {
      treeDatumString = treeDatumString + `droppable: ${resource.droppable}`
    }
    if (resource.selectable) {
      treeDatumString = treeDatumString + `selectable: ${resource.selectable}`
    }
    if (resource.key) {
      treeDatumString = treeDatumString + `key: ${resource.key}`
    }
    if (resource.notation) {
      treeDatumString = treeDatumString + `notation: ${resource.notation}`
    }
    if (resource.domain_mts) {
      treeDatumString = treeDatumString + `domain_mts: ${resource.domain_mts}`
    }
    if (resource.uuid) {
      treeDatumString = treeDatumString + `uuid: ${resource.uuid}`
    }
    return treeDatumString + '}'
  }
}
