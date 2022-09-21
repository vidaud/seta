import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem, MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { AdvancedFiltersModel } from '../../models/advanced-filters.model';
import { QueryModel } from '../../models/query.model';
import { CorpusCentralService } from '../../services/corpus-central.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { DeleteFolderComponent } from '../modals/delete-folder/delete-folder.component';

@Component({
  selector: 'app-query-store-tree',
  templateUrl: './query-store-tree.component.html',
  styleUrls: ['./query-store-tree.component.scss'],
  providers: [TreeDragDropService]
})
export class QueryStoreTreeComponent implements OnInit {


  @Input()
  files: TreeNode[];

  selectedFile: TreeNode;

  items: MenuItem[];

  dymanicMenuItems: MenuItem[] = []

  // @ViewChild('cm') cm: ContextMenu;


  @Output() onMenuClicked: EventEmitter<any> = new EventEmitter<any>();

  // editVisible= {value: true};
  // deleteVisible = {value: true};
  // newFolderVisible = {value: true};
  // newSearchVisible = {value: true};

  @Output()
  public nodeSelected: EventEmitter<CorpusSearchPayload> = new EventEmitter<CorpusSearchPayload>();


  constructor(private messageService: MessageService,
    private corpusCentral: CorpusCentralService,
    private _modalService: NgbModal) { }

  ngOnInit() {

  }

  editNode(node: TreeNode) {
    node.type = 'edit';
    // this.saveEdit(node)
  }

  unselectFile() {
    this.selectedFile = null;
  }

  nodeSelect(event) {
    if (event.node.leaf && event.node.type === 'default') {
      this.messageService.add({
        key: 'tl',
        severity: 'info',
        summary: 'Searching...',
        detail: event.node.label,
      });
      this.nodeSelected.next(event.node.data.payload)
    }

  }

  nodeUnselect(event) {
    this.messageService.add({
      key: 'tl',
      severity: 'info',
      summary: 'Node Unselected',
      detail: event.node.label,
    });
  }

  addFolder(selectedFile: TreeNode) {
    if (!(selectedFile.children.find((child) => child.type !== 'default'))) {
      this.addChild(selectedFile, {
        label: '',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        data: '',
        leaf: false,
        type: 'newchild',
        children: []
      });
    }
  }

  addQuery(node: TreeNode) {
    if (this.corpusCentral.getLastState()) {
      if (!(node.children.find((child) => child.type !== 'default'))) {
        this.addChild(node, {
          label: '',
          data: '',
          icon: "pi pi-search",
          leaf: true,
          type: 'newchild',
        });
      }
    } else {
      this.messageService.add({
        key: 'tl',
        severity: 'error',
        summary: 'Please make sure to execute a search before trying to save',
        detail: node.label,
      });
      // this.toastService.info('Please make sure to execute a search before trying to save');
    }
  }

  addChild(selectedFile: TreeNode, newNode: TreeNode) {
    if (selectedFile && newNode) {
      selectedFile.children.push(newNode);
      selectedFile.expanded = true
    }
  }

  deleteChild(node: TreeNode) {
    if (node && node.parent) {
      let index = node.parent.children.indexOf(node);
      node.parent.children.splice(index, 1);
    }
    this.messageService.add({
      key: 'tl',
      severity: 'info',
      summary: 'Deleted',
      detail: node.label,
    });
    this.save(node)
  }

  open(node: TreeNode) {
    if (!node.leaf && node.children && node.children.length > 0) {
      const modalRef = this._modalService.open(DeleteFolderComponent);
      modalRef.componentInstance.foldername = node.data.name;
      modalRef.result.then(() => {
        this.deleteChild(node)
      });
    } else {
      this.deleteChild(node)
    }
  }

  saveEdit(node: TreeNode) {
    this.messageService.add({
      key: 'tl',
      severity: 'info',
      summary: 'Renamed',
      detail: node.label,
    });
    this.save(node)
  }


  saveNewNode(node: TreeNode) {
    if (node.leaf) {
      let queryModel = undefined
      // if (this.corpusCentral.getLastState()) {
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
          // res_type and sector are Set types and have to be serialized as string[]
          sector: qm.payload.sector ? [...qm.payload.sector] : [],
          res_type: qm.payload.res_type ? [...qm.payload.res_type] : []
        }
      }
      node.data = queryModel

      // } else {
      //   this.messageService.add({
      //     key: 'tl',
      //     severity: 'error',
      //     summary: 'Please make sure to execute a search before trying to save',
      //     detail: node.label,
      //   });
      //   return;
      //   // this.toastService.info('Please make sure to execute a search before trying to save');
      // }
      this.messageService.add({
        key: 'tl',
        severity: 'info',
        summary: 'Added new query',
        detail: node.label,
      });
    } else {
      this.messageService.add({
        key: 'tl',
        severity: 'info',
        summary: 'Added new folder',
        detail: node.label,
      });
      node.data = ""
    }
    this.save(node)
  }

  save(node: TreeNode) {
    node.type = 'default';
    this.corpusCentral.saveQuery(this.files);
  }

  getContextMenu(event) {
    let dynamicItems: MenuItem[] = [];
    if (event.node.leaf === true) {
      dynamicItems = [...this.items.filter((item) => {
        return ['Edit', 'Delete'].indexOf(item.label) !== -1;
      })]
    } else {
      dynamicItems = [...this.items]
    }
    this.dymanicMenuItems = [...dynamicItems]
    console.log(`dynamicItems: ${dynamicItems}`);
  }

  onDrop(event) {
    if (!event.dropNode.leaf) {
      event.accept();
      this.corpusCentral.saveQuery(this.files);
    }
  }

  deleteQueryByName(key: string) {
    // if (this.isUserLoggedIn()) {
    this.corpusCentral.deleteStateByName(key).subscribe((result) => {
      let message = result ? 'State deleted!' : 'You are not logged in!'
      if (message === 'State deleted!') {
        // this.toastService.success(message)
      }
    })
    // }
  }

  executeQuery(curpusSearchPayload: CorpusSearchPayload) {
    if (curpusSearchPayload && curpusSearchPayload !== null) {
      this.corpusCentral.eurlexFilters.next(curpusSearchPayload);
      this.corpusCentral.search();
    }
  }


}

