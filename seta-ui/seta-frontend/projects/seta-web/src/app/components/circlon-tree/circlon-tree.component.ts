import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ITreeOptions, TREE_ACTIONS, KEYS, TreeComponent } from '@circlon/angular-tree-component';
import { TreeInputModel } from '../dynamic-tree/tree-input.model';

@Component({
  selector: 'app-circlon-tree',
  templateUrl: './circlon-tree.component.html',
  styleUrls: ['./circlon-tree.component.scss']
})
export class CirclonTreeComponent implements OnInit {

  @Input() nodeItems: TreeInputModel[];

  options: ITreeOptions = {
    displayField: 'name',
    isExpandedField: 'expanded',
    idField: 'uuid',
    // hasChildrenField: 'nodes',
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        }
      }
    },
    // nodeHeight: 23,
    allowDrag: true,
    allowDrop: (element, { parent, index }) => {
      // return true / false based on element, to.parent, to.index. e.g.
      return parent.hasChildren;
    },
    allowDragoverStyling: true,
    // levelPadding: 10,
    // useVirtualScroll: true,
    // animateExpand: true,
    // scrollOnActivate: true,
    // animateSpeed: 30,
    // animateAcceleration: 1.2,
    // scrollContainer: document.documentElement // HTML
  }


  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
