import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IActionMapping, ITreeOptions, TreeComponent, TreeModel, TreeNode, TREE_ACTIONS } from '@circlon/angular-tree-component';
import { faFolderPlus, faMinusSquare, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { AdvancedFiltersModel } from '../../models/advanced-filters.model';
import { QueryModel } from '../../models/query.model';
import { AppToastService } from '../../services/app-toast.service';
import { CorpusCentralService } from '../../services/corpus-central.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { DeleteFolderComponent } from '../modals/delete-folder/delete-folder.component';
import { TreeInputModel } from './tree-input.model';


@Component({
  selector: 'app-dynamic-tree',
  templateUrl: './dynamic-tree.component.html',
  styleUrls: ['./dynamic-tree.component.scss']
})
export class DynamicTreeComponent implements OnInit, AfterViewInit, OnDestroy {

  public faPlus = faPlus
  public faMinusSquare = faMinusSquare
  public faFolderPlus = faFolderPlus
  public faSave = faSave

  @Input() nodeItems: TreeInputModel[];

  nodeItems$: Observable<TreeInputModel[]>

  dropdownClick: boolean = false

  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;

  @Output()
  public nodeSelected: EventEmitter<CorpusSearchPayload> = new EventEmitter<CorpusSearchPayload>();

  constructor(private corpusCentral: CorpusCentralService,
    private toastService: AppToastService,
    private _modalService: NgbModal) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe(() => this.dropdownClick = true);

  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }



  actionMapping: IActionMapping = {
    mouse: {
      expanderClick: null,
      click: (tree, node, $event) => {
        if (!node.data.isDirectory) {
          this.nodeSelected.next(node.data.corpus.payload)
        } else {
          if (node.data.children.length === 0) {
            node.data.isExpanded = !node.data.isExpanded
            this.tree.treeModel.update();
          } else {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event)
          }
        }
      },
      drop: (tree: TreeModel, node: TreeNode, $event: any, { from, to }: { from: any; to: any; }) => {
        TREE_ACTIONS.MOVE_NODE(tree, node, $event, { from, to })
      }

    },
  }


  options: ITreeOptions = {
    allowDrag: (node) => {
      return true;
    },
    allowDrop: (element, { parent, index }) => {
      return parent.data.isDirectory;
    },
    isExpandedField: "isExpanded",
    actionMapping: this.actionMapping,
  }

  @ViewChild(TreeComponent)
  private tree: TreeComponent;


  delete(node: TreeNode): void {
    const indexNodeToRemove = node.parent.data.children.indexOf(node.data);
    node.parent.data.children.splice(indexNodeToRemove, 1);
    this.tree.treeModel.update();
  }


  createLeaf(node): void {
    let queryModel = undefined
    if (this.corpusCentral.getLastState()) {
      let newPayload = new CorpusSearchPayload({ ...this.corpusCentral.getLastState() });
      this.corpusCentral.eurlexFilters.next(newPayload)
      let qm = new QueryModel(
        {
          payload: new CorpusSearchPayload({ ...newPayload }),
          filters: this.corpusCentral.formMemory.getValue() !== null ?
            new AdvancedFiltersModel({ ...this.corpusCentral.formMemory.getValue() })
            :
            null
        })
      queryModel = {
        ...qm,
        payload:
        {
          ...qm.payload,
          // res_type and collection are Set types and have to be serialized as string[]
          collection: qm.payload.collection ? [...qm.payload.collection] : [],
          reference: qm.payload.reference ? [...qm.payload.reference] : []        }
      }
      const leafName = prompt('Please enter leaf name');
      if (leafName && leafName !== null) {
        let finalLeafName = leafName.trim()
        if (finalLeafName !== "" && queryModel) {
          let children = node.data.children
          // let children = this.tree.treeModel.nodes[0].children
          children.splice(children.length - 1, 0, { name: finalLeafName, isDirectory: false, isExpanded: false, corpus: queryModel });
          this.tree.treeModel.update();
        }
      }
    } else {
      this.toastService.info('Please make sure to execute a search before trying to save');
    }
  }

  createFolder(node): void {
    const folderName = prompt('Please enter folder name');
    if (folderName && folderName !== null) {
      let finalFolderName = folderName.trim()
      if (finalFolderName !== "" && finalFolderName !== "My queries") {
        let children = node.data.children
        // let children = this.tree.treeModel.nodes[0].children
        children.splice(children.length - 1, 0,
          { name: finalFolderName, isDirectory: true, isExpanded: true, children: [] });
        this.tree.treeModel.update();
      } else {
        this.toastService.warn('Name already in use');
      }
    }
  }

  saveTree(event) {
    if (this.dropdownClick !== true) {
      this.corpusCentral.saveQuery(this.tree.treeModel.nodes)
    }
    this.dropdownClick = false
  }

  onEvent = (node) => {
    if (node.data.isDirectory) {
      node.data.isExpanded = this.toggleExpanded(node)
    }
    this.tree.treeModel.update();
  }

  toggleExpanded(node: TreeNode) {
    return !node.data.isExpanded
  }

  open(node) {
    if (node.data.isDirectory && node.data.children.length > 0) {
      const modalRef = this._modalService.open(DeleteFolderComponent);
      modalRef.componentInstance.foldername = node.data.name;
      modalRef.result.then(() => {
        this.delete(node)
      });
    } else {
      this.delete(node)
    }
  }

}


