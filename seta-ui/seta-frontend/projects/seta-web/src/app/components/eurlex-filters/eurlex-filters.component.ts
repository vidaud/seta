import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Select } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { AdvancedFiltersModel } from '../../models/advanced-filters.model';
import { SubjectType } from '../../models/document.model';
import { ActCategoryDto, DirectoryConceptsDto, DocumentSector, EurlexMetadataDto, ResourceTypeDto, TreeDatum } from '../../models/eurlexMetadataDto.model';
import { EurovocThesaurusModel } from '../../models/eurovoc-thesaurus.model';
import { CorpusCentralService } from '../../services/corpus-central.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { SetaState } from '../../store/seta.state';
import { AdvancedFiltersForm } from '../seta-advanced-filters/seta-advanced-filters.component';



@Component({
  selector: 'app-eurlex-filters',
  templateUrl: './eurlex-filters.component.html',
  styleUrls: ['./eurlex-filters.component.scss'],
})
export class EurlexFiltersComponent implements OnInit {

  @Output()
  public isFilterCounterUpdated: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  public fatherGroup: FormGroup;

  @Input() cleanFilters: Observable<void>;

  @Input() saveFilters: Observable<void>;

  resourceTypeDtos: ResourceTypeDto[] = [];
  documentSectors: DocumentSector[] = [];
  subjectTypeDtos: SubjectType[] = [];
  public actCategoryMap: { [x: string]: ActCategoryDto; } = {};
  actCategoriesDto: any[];
  eurovocThesaurusConcepts: EurovocThesaurusModel[];
  public eurovocDomMapDto: { [x: string]: string; } = {};
  checksFirstColumn: any;
  public faQuestionCircle = faQuestionCircle;
  public infoForceValues: any[] = [{ value: ``, label: `` }, { value: `true`, label: `YES` }, { value: `false`, label: `NO` }];
  eurlexFilters: CorpusSearchPayload;
  formMemory: AdvancedFiltersModel;

  eurovocNodes: TreeNode[] = [];
  selectedEurovocNodes: TreeDatum[] = [];

  directoryNodes: TreeDatum[] = [];
  selectedDirectoryNodes: TreeDatum[] = [];
  eurlexMetadataFiltersValues: any;

  year: number;
  range: any[];

  constructor(private corpusCentral: CorpusCentralService,
    private fb: FormBuilder,
  ) {

  }


  @Select(SetaState.eurlexMetadata)
  public eurlexMetadata$: Observable<EurlexMetadataDto>;

  get eurlexMetadataFilters() {
    return this.fatherGroup.get(`eurlexMetadataFilters`) as FormGroup;
  }

  get selectedResourceTypes() {
    return this.eurlexMetadataFilters.get(`selectedResourceTypes`) as FormControl;
  }

  get actCategories() {
    return this.eurlexMetadataFilters.get(`actCategories`) as FormArray;
  }

  get selectedErovocConcepts() {
    return this.eurlexMetadataFilters.get(`selectedErovocConcepts`) as FormControl;
  }

  get selectedInfoForce() {
    return this.eurlexMetadataFilters.get(`selectedInfoForce`) as FormControl;
  }

  get selectedDirectoryConcepts() {
    return this.eurlexMetadataFilters.get(`selectedDirectoryConcepts`) as FormControl;
  }

  get selectedBeforeDate() {
    return this.eurlexMetadataFilters.get(`selectedBeforeDate`) as FormControl;
  }

  get selectedAfterDate() {
    return this.eurlexMetadataFilters.get(`selectedAfterDate`) as FormControl;
  }
  // ------------------------------------------
  eurovocNodeSelect(event) {
    this.updateEurovocNodes()
  }

  updateEurovocNodes() {
    let newEuroVoc: EurovocThesaurusModel[] = []
    const dom_mts_nodes: TreeDatum[] = []
    const normal_nodes: TreeDatum[] = []
    this.selectedEurovocNodes.forEach((node) => {
      if (node.type === `domain` || node.type === `mts`) {
        dom_mts_nodes.push(node)
      } else {
        normal_nodes.push(node)
      }
    })
    const realDom_MtSelectedNodes: TreeDatum[] = this.treverseListForFathers(dom_mts_nodes)
    const realDom_MtCodes: string[] = realDom_MtSelectedNodes.map((node) => { return node.notation })
    const realNormalSelectedNodes: TreeDatum[] = normal_nodes.filter((node) => {
      const returnResult = []
      for (const el of node.domain_mts) {
        if (!realDom_MtCodes.includes(el)) {
          returnResult.push(true)
        } else {
          returnResult.push(false)
        }
      }
      if (returnResult.reduce<boolean>((accum, curr) => {
        if (accum && curr) {
          return true;
        } else {
          return false;
        }
      }, true)) {
        return node
      }

    })
    realDom_MtSelectedNodes.map((node) => {
      newEuroVoc.push(this.selectEurovocCodes(node))
    })
    realNormalSelectedNodes.map((node) => {
      newEuroVoc.push(this.selectEurovocCodes(node))
    })
    this.selectedErovocConcepts.patchValue(newEuroVoc, { emitEvent: true })
  }

  treverseListForFathers(selectedEurovocNodes: TreeNode<any>[]): TreeNode<any>[] {
    let newTreeNodeList: TreeNode<any>[] = []
    const potentialFathers = selectedEurovocNodes.map((node) => { return node.data })
    selectedEurovocNodes.forEach((node) => {
      if (node.parent === undefined) {
        newTreeNodeList.push(node)
      } else {
        if (!potentialFathers.includes(node.parent.data)) {
          newTreeNodeList.push(node)
        }
      }
    })
    return newTreeNodeList
  }


  selectEurovocCodes(node: TreeDatum): EurovocThesaurusModel {
    const newEurovocNode = new EurovocThesaurusModel()
    switch (node.type) {
      case `domain`:
        newEurovocNode.domCode = node.notation
        newEurovocNode.domLabel = node.label
        break;
      case `mts`:
        newEurovocNode.mthCode = node.notation
        newEurovocNode.mthLabel = node.label
        break;
      case `NT0`:
        newEurovocNode.ttCode = node.data
        newEurovocNode.ttLabel = node.label
        break;
      default:
        newEurovocNode.conceptCode = node.data
        newEurovocNode.conceptLable = node.label
        break;
    }
    return newEurovocNode
  }


  eurovocNodeUnselect(event) {
    this.updateEurovocNodes()
  }
  // ------------------------------------------
  directoryNodeSelect(event) {
    this.updateDirectorycNodes()
  }

  updateDirectorycNodes() {
    let newDirectoryCodes: DirectoryConceptsDto[] = []
    const realNewDirectoryCodes: TreeDatum[] = this.treverseListForFathers(this.selectedDirectoryNodes)
    realNewDirectoryCodes.map((node) => {
      newDirectoryCodes.push(this.selectDirectoryCodes(node))
    })
    this.selectedDirectoryConcepts.patchValue(newDirectoryCodes, { emitEvent: true })
  }

  directoryNodeUnselect(event) {
    this.updateDirectorycNodes()
  }

  selectDirectoryCodes(node: TreeDatum): DirectoryConceptsDto {
    const newDirectoryNode = new DirectoryConceptsDto()
    switch (node.type) {
      case `1`:
        newDirectoryNode.conc_dir_1 = node.data
        break;
      case `2`:
        newDirectoryNode.conc_dir_2 = node.data
        break;
      case `3`:
        newDirectoryNode.conc_dir_3 = node.data
        break;
    }
    return newDirectoryNode
  }

  // ------------------------------------------

  ngOnInit(): void {

    this.year = new Date().getFullYear();
    this.range = [];
    this.range.push(this.year);
    for (var i = 1; i < 150; i++) {
      this.range.push(this.year - i);
    }

    this.saveFilters.subscribe(() => this.onSave())

    this.cleanFilters.subscribe(() => {
      this.eurlexMetadataFilters.reset(
        {
          actCategories: this.fb.array(
            this.actCategoriesDto.map((choice) => new FormControl(false))
          ),
          selectedErovocConcepts: [],
          selectedDirectoryConcepts: [],
          selectedInfoForce: ``,
          selectedResourceTypes: [],
          selectedBeforeDate: `0`,
          selectedAfterDate: `0`
        }
      )
      this.selectedEurovocNodes = []
      this.selectedDirectoryNodes = []
      this.updateEurovocNodes();
      this.updateDirectorycNodes();
    });

    this.eurlexMetadata$.subscribe(((eurlexMetadata: EurlexMetadataDto) => {
      if (eurlexMetadata) {
        this.resourceTypeDtos = [...eurlexMetadata.resourceTypeDtos].sort((a, b) => {
          const textA = a.label.toUpperCase();
          const textB = b.label.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.documentSectors = [...eurlexMetadata.documentSectors];
        this.subjectTypeDtos = [...eurlexMetadata.subjectTypes];
        this.actCategoriesDto = [...eurlexMetadata.actCategories];
        this.eurovocThesaurusConcepts = [...eurlexMetadata.eurovocThesaurusConcepts].map((concept) => {
          return new EurovocThesaurusModel(
            { ...concept, domLabel: concept.domLabel.slice(0, 1) + concept.domLabel.slice(1).toLowerCase() }
          );
        });

        let tempEuroTree = this.traverseTree(eurlexMetadata.eurovocTree)
        tempEuroTree.map((node) => { this.traverseTreeForFathers(node) })
        this.eurovocNodes = tempEuroTree

        let tempDirectoryTree = this.traverseTree(eurlexMetadata.directoryTree)
        tempDirectoryTree.map((node) => { this.traverseTreeForFathers(node) })
        this.directoryNodes = tempDirectoryTree

        for (const key of Object.keys(eurlexMetadata.eurovocDomMapDto)) {
          this.eurovocDomMapDto[eurlexMetadata.eurovocDomMapDto[key]] = key;
        }
        eurlexMetadata.actCategories.map((act: ActCategoryDto) => {
          Object.assign(this.actCategoryMap, { [act.resourceSector.replace(/\s+/g, ``)]: act });
        });

        this.corpusCentral.formMemory.subscribe((formMemory) => {
            this.formMemory = formMemory;
        })

        if (this.corpusCentral.eurovocTreeNode.value.length > 0) {
          this.selectedEurovocNodes.push(...this.traverseTreeForSelection(
            this.corpusCentral.eurovocTreeNode.value,
            this.eurovocNodes,
            []))
        }

        if (this.corpusCentral.directoryTreeNode.value.length > 0) {
          this.selectedDirectoryNodes.push(...this.traverseTreeForSelection(
            this.corpusCentral.directoryTreeNode.value,
            this.directoryNodes,
            []))
        }

        this.corpusCentral.eurlexFilters.subscribe((eurlexFilters: CorpusSearchPayload) => {
          this.eurlexFilters = new CorpusSearchPayload({ ...eurlexFilters });
        })

        // READY to build form
        this.createForm();

        this.eurlexMetadataFilters.valueChanges.subscribe((values) => {
          this.eurlexMetadataFiltersValues = values
        })

      }
    }));

  }

  traverseTreeOnlyOneceForSelection(uuidSelected: string[], ) {

  }

  traverseTreeForSelection(
    codesSelected: string[],
    treesThatHaveToBeTraverserd: TreeDatum[],
    newTreeSelected: TreeDatum[]): TreeDatum[] {
    if (codesSelected && codesSelected.length > 0) {
      let count = treesThatHaveToBeTraverserd.length;
      for (const node of treesThatHaveToBeTraverserd) {
        if (codesSelected.includes(node.uuid)) {
          newTreeSelected.push(node)
          count--;
        }
        if (node.children && node.children.length !== 0) {
          this.traverseTreeForSelection(codesSelected, node.children, newTreeSelected)
        }
      }
      // Once all nodes of a tree are looked at for selection, 
      // see if only some nodes are selected and make this node partially selected
      if (
        treesThatHaveToBeTraverserd.length > 0
        && treesThatHaveToBeTraverserd[0].parent) {
        if (count > 0 && count != treesThatHaveToBeTraverserd.length) {
          this.partialSelectedNodes(treesThatHaveToBeTraverserd[0].parent)
        }
      }
    }
    return newTreeSelected
  }

  partialSelectedNodes(node: TreeNode) {
    node.partialSelected = true
    node.expanded = true
    if (node.parent) {
      this.partialSelectedNodes(node.parent)
    }
  }

  traverseTree(trees: TreeNode[]): TreeNode<any>[] {
    let newTreeHierarchy: TreeNode[] = []
    trees.forEach((node) => {
      if (node.children && node.children.length !== 0) {
        newTreeHierarchy.push(new TreeDatum(
          {
            ...node,
            parent: undefined,
            children: this.traverseTree([...node.children])
          }
        ))
      } else {
        newTreeHierarchy.push(new TreeDatum(
          {
            ...node,
            parent: undefined
          }
        ))
      }

    });
    return newTreeHierarchy
  }


  traverseTreeForFathers(tree: TreeNode) {
    const parent = tree
    if (tree.children && tree.children.length !== 0) {
      tree.children.forEach((child) => {
        child.parent = parent
        if (!child.leaf) {
          this.traverseTreeForFathers(child)
        }
      })
    } else {
      tree.parent = parent
    }
  }


  createForm() {
    let isPreviousFormPresent = false;
    if (this.formMemory && this.formMemory !== null && this.formMemory.eurlexForm && this.formMemory.eurlexForm !== null) {
      if (this.formMemory.eurlexForm.eurlexMetadataFilters && this.formMemory.eurlexForm.eurlexMetadataFilters !== null) {
        isPreviousFormPresent = true;
      }
    }

    if (isPreviousFormPresent) {
      const formM = this.formMemory.eurlexForm.eurlexMetadataFilters
      this.fatherGroup.addControl(`eurlexMetadataFilters`, this.fb.group({
        actCategories: this.fb.array(
          this.formMemory ?
            formM.actCategories.map((choice) => new FormControl(choice))
            :
            this.actCategoriesDto.map((choice) => new FormControl(false))
        ),
        selectedErovocConcepts:
          formM.selectedErovocConcepts && formM.selectedErovocConcepts !== null ?
            [
              formM.selectedErovocConcepts.map((concept) => {
                return concept
              })
            ]
            :
            []
        ,
        selectedDirectoryConcepts:
          formM.selectedDirectoryConcepts && formM.selectedDirectoryConcepts !== null ?
            [
              formM.selectedDirectoryConcepts.map((concept) => {
                return concept
              })
            ]
            :
            []
        ,
        selectedInfoForce:
          formM.selectedInfoForce && formM.selectedInfoForce !== null ?
            formM.selectedInfoForce
            :
            ``
        ,
        selectedResourceTypes:
          formM.selectedResourceTypes && formM.selectedResourceTypes !== null ?
            new FormControl({ value: formM.selectedResourceTypes, disabled: false })
            :
            new FormControl({ value: [], disabled: false })
        ,
        selectedBeforeDate:
          formM.selectedBeforeDate && formM.selectedBeforeDate !== null ?
            new FormControl(formM.selectedBeforeDate)
            :
            new FormControl()
        ,
        selectedAfterDate:
          formM.selectedAfterDate && formM.selectedAfterDate !== null ?
            new FormControl(formM.selectedAfterDate)
            :
            new FormControl()
        ,
      }))
    } else {
      this.fatherGroup.addControl(`eurlexMetadataFilters`, this.fb.group({
        actCategories: this.fb.array(
          this.actCategoriesDto.map((choice) => new FormControl(false))
        ),
        selectedErovocConcepts: [],
        selectedDirectoryConcepts: [],
        selectedInfoForce: ``,
        selectedResourceTypes: new FormControl({ value: [], disabled: false }),
        selectedBeforeDate: new FormControl(),
        selectedAfterDate: new FormControl(),
      }));
    }

  }

  onSave() {
    if (this.eurlexMetadataFiltersValues) {
      const values = this.eurlexMetadataFiltersValues

      const idSectors = new Set<string>();
      const resources = new Set<string>();
      const eurovocDomValues: string[] = [];
      const eurovocMthValues: string[] = [];
      const eurovocTTValues: string[] = [];
      const eurovocConceptValues: string[] = [];
      const conc_dir_1: string[] = [];
      const conc_dir_2: string[] = [];
      const conc_dir_3: string[] = [];
      const actCategoryDto = [];
      const data_range: string[] = []
      for (let index = 0; index < values.actCategories.length; index++) {
        const bool = values.actCategories[index];
        if (bool) {
          actCategoryDto.push(this.actCategoriesDto[index]);
        }
      }
      actCategoryDto.forEach((act) => {
        for (const filter of act.filters) {
          if (filter.filterName === `listResourceType`) {
            filter.filterValues.forEach((val) => resources.add(val));

          } else if (filter.filterName === `idSector`) {
            filter.filterValues.forEach((val) => idSectors.add(val));

          }
        }
      });
      values.selectedResourceTypes.forEach((val) => resources.add(val));
      let newEurlexFilters
      if (this.eurlexFilters != null) {
        newEurlexFilters = new CorpusSearchPayload({ ...this.eurlexFilters })
      } else {
        newEurlexFilters = new CorpusSearchPayload()
      }
      newEurlexFilters.res_type = resources;
      newEurlexFilters.sector = idSectors;

      if (values.selectedErovocConcepts) {
        values.selectedErovocConcepts.map((concept: EurovocThesaurusModel) => {
          if (concept.domCode) {
            eurovocDomValues.push(concept.domCode);
          } else if (concept.mthCode) {
            eurovocMthValues.push(concept.mthCode);
          } else if (concept.ttCode) {
            eurovocTTValues.push(concept.ttCode);
          } else {
            eurovocConceptValues.push(concept.conceptCode);
          }
        });
        newEurlexFilters.eurovoc_dom = eurovocDomValues;
        newEurlexFilters.eurovoc_mth = eurovocMthValues;
        newEurlexFilters.eurovoc_tt = eurovocTTValues;
        newEurlexFilters.eurovoc_concept = eurovocConceptValues;
        // Save selected notes into data structure that can me easily serialized
        this.corpusCentral.eurovocTreeNode.next(this.selectedEurovocNodes.map((node) => node.uuid))
      }

      if (values.selectedDirectoryConcepts) {
        values.selectedDirectoryConcepts.map((concept: DirectoryConceptsDto) => {
          if (concept.conc_dir_1) {
            conc_dir_1.push(concept.conc_dir_1);
          } else if (concept.conc_dir_2) {
            conc_dir_2.push(concept.conc_dir_2);
          } else if (concept.conc_dir_3) {
            conc_dir_3.push(concept.conc_dir_3);
          }
        });
        newEurlexFilters.conc_dir_1 = conc_dir_1;
        newEurlexFilters.conc_dir_2 = conc_dir_2;
        newEurlexFilters.conc_dir_3 = conc_dir_3;
        // Save selected notes into data structure that can me easily serialized
        this.corpusCentral.directoryTreeNode.next(this.selectedDirectoryNodes.map((node) => node.uuid))
      }

      if (values.selectedBeforeDate && values.selectedBeforeDate !== null && values.selectedBeforeDate !== `0`) {
        data_range.push(`lte:${values.selectedBeforeDate}`)

      }
      if (values.selectedAfterDate && values.selectedAfterDate !== null && values.selectedAfterDate !== `0`) {
        data_range.push(`gte:${values.selectedAfterDate}`)
      }
      newEurlexFilters.date_range = data_range;

      (values.selectedInfoForce && values.selectedInfoForce !== ``) ?
        newEurlexFilters.info_force = values.selectedInfoForce === `true` ? true : false
        :
        newEurlexFilters.info_force = null

      this.corpusCentral.eurlexFilters.next(new CorpusSearchPayload({ ...this.eurlexFilters, ...newEurlexFilters }));
    }
  }


  selectNodes2(tree: TreeNode[], checkedNodes: TreeNode[], keys: string[]) {
    let count = tree.length;
    for (const node of tree) {
      // If the current nodes key is in the list of keys to select, 
      // or it's parent is selected then select this node as well
      if (keys.includes(node.key) || checkedNodes.includes(node.parent)) {
        checkedNodes.push(node);
        count--;
      }

      // Look at the current node's children as well
      if (node.children)
        this.selectNodes2(node.children, checkedNodes, keys);
    }

    // Once all nodes of a tree are looked at for selection, see if only some nodes are selected and make this node partially selected
    if (tree.length > 0 && tree[0].parent) tree[0].parent.partialSelected = (count > 0 && count != tree.length);
  }

  public compareConcepts = (item, selected) => {
    if (selected.mthCode) {
      if (item.mthCode) {
        if (item.mthCode === selected.mthCode) {
          return true
        }
      }
    } else {
      if (selected.domLabel && item.domLabel) {
        if (item.domLabel === selected.domLabel) {
          return true
        }
      }
    }
    return false;
  }



}
