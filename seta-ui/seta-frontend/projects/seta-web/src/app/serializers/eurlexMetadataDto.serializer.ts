import { TreeNode } from 'primeng/api';
import { updateFunctionDeclaration } from 'typescript';
import { SubjectType } from '../models/document.model';
import { ActCategoryDto, DocumentSector, EurlexMetadataDto, ResourceTypeDto, TreeDatum } from '../models/eurlexMetadataDto.model';
import { EurovocThesaurusModel } from '../models/eurovoc-thesaurus.model';
import { Resource } from '../models/resource.model';
import { Serializer } from './serializer.interface';
import { v4 as uuidv4 } from "uuid";
import { RestService } from '../services/rest.service';
import { TreeDatumSerializer } from './tree-datum.serializer';

export class EurlexMetadataDtoSerializer implements Serializer {

  public fromJson(json: any): EurlexMetadataDto {
    const eurlexMetadataDto = new EurlexMetadataDto();
    eurlexMetadataDto.actCategories = json.actCategoryDtos.map((act) => new ActCategoryDto(act));
    Object.keys(json.eurovocMthMapDto).forEach((key) => { eurlexMetadataDto.eurovocMthMapDto[key] = json.eurovocMthMapDto[key]; });
    Object.keys(json.eurovocDomMapDto).forEach((key) => { eurlexMetadataDto.eurovocDomMapDto[key] = json.eurovocDomMapDto[key]; });
    eurlexMetadataDto.eurovocThesaurusConcepts = json.eurovocThesaurusConceptDtos.map((voc) => new EurovocThesaurusModel(voc));
    eurlexMetadataDto.eurovocTree = this.traverseEurovocTreeInit(json.eurovocTree.data, 0, [])
    eurlexMetadataDto.eurovocTree.map((tree) => this.traverseTree(tree))
    //eurlexMetadataDto.directoryTree = this.traverseTreeDirectory(json.directoryTree.data, 1)
    eurlexMetadataDto.resourceTypeDtos = json.resourceTypeDtos.map((res: any) => new ResourceTypeDto(res));
    eurlexMetadataDto.documentSectors = json.documentSectorAndTypes.map((doc: any) => new DocumentSector(doc));
    eurlexMetadataDto.subjectTypes = json.subjectTypes.map((sub: any) => new SubjectType(sub));
    return eurlexMetadataDto;
  }
  toJson(resource: Resource) {
    throw new Error(`Method not implemented.`);
  }

  traverseEurovocTreeInit(trees: TreeDatum[], index: number, domain_mts: string[]): TreeDatum[] {
    let newTreeDirectoryHierarchy: TreeNode[] = []
    trees.forEach((node) => {
      // node.uuid = uuidv4()
      if (node.children && node.children.length !== 0) {
        newTreeDirectoryHierarchy.push(new TreeDatum(
          {
            ...node,
            partialSelected: false,
            expanded: false,
            selectable: node.type === "top" ? false : true,
            type: node.type === "normal" && index > 2 ? `NT${index - 3}` : node.type,
            domain_mts: node.type === "normal" ? [...domain_mts] : [],
            // uuid: uuidv4(),
            leaf: false,
            children:
              this.traverseEurovocTreeInit(
                [...node.children],
                index + 1,
                node.type !== "normal" ? [node.notation, ...domain_mts] : [...domain_mts]
              )
          }
        ))
      } else {
        newTreeDirectoryHierarchy.push(new TreeDatum(
          {
            ...node,
            partialSelected: false,
            expanded: false,
            selectable: node.type === "top" ? false : true,
            leaf: true,
            type: node.type === "normal" && index > 2 ? `NT${index - 3}` : node.type,
            domain_mts: node.type === "normal" ? [...domain_mts] : [],
            // uuid: uuidv4(),
          }
        ))
      }

    });
    return newTreeDirectoryHierarchy
  }

  traverseTreeDirectory(trees: TreeDatum[], index: number): TreeNode[] {
    let newTreeDirectoryHierarchy: TreeNode[] = []
    trees.forEach((node) => {
      // node.uuid = uuidv4()
      if (node.children && node.children.length !== 0) {
        newTreeDirectoryHierarchy.push(new TreeDatum(
          {
            ...node,
            partialSelected: false,
            expanded: false,
            selectable: node.label === `Directory codes` ? false : true,
            type: `` + index,
            leaf: false,
            children:
              this.traverseTreeDirectory([...node.children], index + 1)
          }
        ))
      } else {
        newTreeDirectoryHierarchy.push(new TreeDatum(
          {
            ...node,
            partialSelected: false,
            expanded: false,
            leaf: true,
            selectable: node.label === `Directory codes` ? false : true,
            type: `` + index
          }
        ))
      }

    });
    return newTreeDirectoryHierarchy
  }

  traverseTree(tree: TreeNode) {
    const parent = new TreeDatum({
      ...tree
    })
    if (tree.children && tree.children.length !== 0) {
      tree.children.forEach((child) => {
        child.parent = parent
        if (!child.leaf) {
          this.traverseTree(child)
        }
      })
    } else {
      tree.parent = parent
    }
  }

  public copyToClipboard(item: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = item;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }


}
